import express from "express";
import pify from "pify";
import multer from "multer";
import sharp from "sharp";
import moment from "moment";
import randomString from "random-string";
import mkdirs from "node-mkdirs";

import sessionCtx from "../../core/session";
import { txrtfn } from "../../core/tx";
import validator, { Joi } from "../../lib/validator";

import Upload from "../../sql/Upload";

const router = express.Router();

// 파일 업로드 경로 처리
let dypth = moment().format("YYYYMMDD");
let storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "./uploads/" + dypth);
  },
  filename(req, file, cb) {
    let ext = file.mimetype.split("/")[1];
    cb(
      null,
      (() => {
        return randomString({ length: 20 })
          .concat(dypth)
          .split("")
          .sort(function() {
            return 0.5 - Math.random();
          })
          .join("");
      })() +
        "." +
        ext
    );
  }
});

// 파일 확장자 체크
const fileAllowExt = ext => {
  const extList = [
    "jpge",
    "jpeg",
    "jpg",
    "png",
    "bmp",
    "gif",
    "heic",
    "heif",
    "pdf",
    "hwp",
    "zip",
    "alz",
    "rar",
    "ppt",
    "xlsx",
    "xls",
    "doc"
  ];
  for (let i = 0; i < extList.length; i++) {
    if (extList[i].match(ext.toLowerCase())) {
      return true;
    }
  }
  return false;
};

const imageAllowExt = ext => {
  const extList = ["jpge", "jpeg", "jpg", "png", "gif", "bmp", "heic", "heif"];
  for (let i = 0; i < extList.length; i++) {
    if (extList[i].match(ext.toLowerCase())) {
      return true;
    }
  }
  return false;
};

const multerFile = pify(
  multer({
    storage,
    limits: {
      files: 1,
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
      let fname = file.originalname;
      const ext = fname.substr(fname.lastIndexOf(".") + 1, fname.length);
      if (!fileAllowExt(ext)) {
        cb(new Error(`${ext} 파일은 업로드할 수 없습니다.`));
        return;
      }
      cb(null, true);
    }
  }).single("file")
);

const multerImage = pify(
  multer({
    storage,
    limits: {
      files: 1,
      fileSize: 1024 * 1024 * 5
    },
    fileFilter: (req, file, cb) => {
      let fname = file.originalname;
      const ext = fname.substr(fname.lastIndexOf(".") + 1, fname.length);
      if (!imageAllowExt(ext)) {
        cb(new Error(`이미지 파일만 업로드할 수 없습니다.`));
        return;
      }
      cb(null, true);
    }
  }).single("file")
);

// 파일 업로드 API
router.post(
  "/file",
  sessionCtx.isAdmin(), // 관리자 권한
  txrtfn(async (req, res, next, conn) => {
    await mkdirs("./uploads/" + dypth);
    try {
      await multerFile(req, res);
    } catch (e) {
      let message = e.message;
      if (message == "File too large") {
        message = "파일의 최대 허용 크기는 5MB입니다.";
      }
      res.status(500).json({ message });
      return;
    }

    const { file } = req;

    if (!file) {
      res.status(500).json({ message: "파일이 존재하지 않습니다." });
      return;
    }

    let mimetype = file.mimetype;
    let ext = file.mimetype.split("/")[1];
    let name = file.originalname;
    let size = file.size;
    let src = `${process.env.APP_DOMAIN}/uploads/${dypth}/${file.filename}`;

    let upload = { mimetype, ext, name, size, src };

    const UPLOAD = Upload(conn);

    const insertId = await UPLOAD.insertOne(upload);

    res.status(200).json({
      idx: insertId,
      name: upload.name,
      src: upload.src,
      originalFilename: name
    });
  })
);

// 이미지 업로드 API
router.post(
  "/image",
  sessionCtx.isAdmin(), // 관리자 권한
  txrtfn(async (req, res, next, conn) => {
    await mkdirs("./uploads/" + dypth);
    try {
      await multerImage(req, res);
    } catch (e) {
      let message = e.message;
      if (message == "File too large") {
        message = "이미지 파일 최대 허용 크기는 5MB입니다.";
      }
      res.status(500).json({ message });
      return;
    }

    const { file } = req;

    if (!file) {
      res.status(500).json({ message: "파일이 존재하지 않습니다." });
      return;
    }

    let mimetype = file.mimetype;
    let ext = file.mimetype.split("/")[1];
    let name = file.originalname;
    let size = file.size;
    let src = `${process.env.APP_DOMAIN}/uploads/${dypth}/${file.filename}`;

    let upload = { mimetype, ext, name, size, src };

    const UPLOAD = Upload(conn);

    const data = await UPLOAD.insertOne(upload);

    res.status(200).json({ name: upload.name, src: upload.src });
  })
);

// 썸네일 업로드 API
router.post(
  "/thumbnail",
  sessionCtx.isAdmin(), // 관리자 권한
  validator.query({
    width: Joi.number().required(),
    height: Joi.number().required()
  }),
  txrtfn(async (req, res, next, conn) => {
    const { width, height } = req.query;
    await mkdirs("./uploads/" + dypth);
    try {
      await multerImage(req, res);
      await sharp(`./uploads/${dypth}/${req.file.filename}`)
        .resize(parseInt(width), parseInt(height))
        .toFile(`./uploads/${dypth}/th_${req.file.filename}`);
    } catch (e) {
      let message = e.message;
      if (message == "File too large") {
        message = "이미지 파일 최대 허용 크기는 5MB입니다.";
      }
      res.status(500).json({ message });
      return;
    }

    const { file } = req;

    if (!file) {
      res.status(500).json({ message: "파일이 존재하지 않습니다." });
      return;
    }

    let mimetype = file.mimetype;
    let ext = file.mimetype.split("/")[1];
    let name = "th_" + file.originalname;
    let size = file.size;
    let src = `${process.env.APP_DOMAIN}/uploads/${dypth}/th_${file.filename}`;

    let upload = { mimetype, ext, name, size, src };

    const UPLOAD = Upload(conn);

    const data = await UPLOAD.insertOne(upload);

    res.status(200).json({ name: upload.name, src: upload.src });
  })
);

export default router;
