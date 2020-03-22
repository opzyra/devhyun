import pify from 'pify';
import multer from 'multer';
import moment from 'moment';
import randomString from 'random-string';
import sharp from 'sharp';
import mkdirs from 'node-mkdirs';

// 파일 업로드 경로 처리
let dypth = moment().format('YYYYMMDD');
let storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/' + dypth);
  },
  filename(req, file, cb) {
    let ext = file.mimetype.split('/')[1];
    cb(
      null,
      (() => {
        return randomString({ length: 20 })
          .concat(dypth)
          .split('')
          .sort(function() {
            return 0.5 - Math.random();
          })
          .join('');
      })() +
        '.' +
        ext,
    );
  },
});

// 파일 확장자 체크
const fileAllowExt = ext => {
  const extList = [
    'jpge',
    'jpeg',
    'jpg',
    'png',
    'bmp',
    'gif',
    'heic',
    'heif',
    'pdf',
    'hwp',
    'zip',
    'alz',
    'rar',
    'ppt',
    'xlsx',
    'xls',
    'doc',
  ];
  for (let i = 0; i < extList.length; i++) {
    if (extList[i].match(ext.toLowerCase())) {
      return true;
    }
  }
  return false;
};

const imageAllowExt = ext => {
  const extList = ['jpge', 'jpeg', 'jpg', 'png', 'gif', 'bmp', 'heic', 'heif'];
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
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: (req, file, cb) => {
      let fname = file.originalname;
      const ext = fname.substr(fname.lastIndexOf('.') + 1, fname.length);
      if (!fileAllowExt(ext)) {
        cb(new Error(`${ext} 파일은 업로드할 수 없습니다.`));
        return;
      }
      cb(null, true);
    },
  }).single('file'),
);

const multerImage = pify(
  multer({
    storage,
    limits: {
      files: 1,
      fileSize: 1024 * 1024 * 5,
    },
    fileFilter: (req, file, cb) => {
      let fname = file.originalname;
      const ext = fname.substr(fname.lastIndexOf('.') + 1, fname.length);
      if (!imageAllowExt(ext)) {
        cb(new Error(`이미지 파일만 업로드할 수 없습니다.`));
        return;
      }
      cb(null, true);
    },
  }).single('file'),
);

const file = async (req, res) => {
  await mkdirs('./uploads/' + dypth);

  try {
    await multerFile(req, res);
  } catch (error) {
    let message = error.message;
    if (message == 'File too large') {
      error.message = '파일의 최대 허용 크기는 5MB입니다.';
    }
    throw error;
  }

  const { file } = req;

  if (!file) {
    res.status(500).json({ message: '파일이 존재하지 않습니다.' });
    return;
  }

  let mimetype = file.mimetype;
  let ext = file.mimetype.split('/')[1];
  let name = file.originalname;
  let size = file.size;
  let src = `${process.env.APP_DOMAIN}/uploads/${dypth}/${file.filename}`;

  return { mimetype, ext, name, size, src };
};

const image = async (req, res) => {
  await mkdirs('./uploads/' + dypth);

  try {
    await multerImage(req, res);
  } catch (error) {
    let message = error.message;
    if (message == 'File too large') {
      error.message = '이미지 파일 최대 허용 크기는 5MB입니다.';
    }
    throw error;
  }

  const { file } = req;

  if (!file) {
    res.status(500).json({ message: '파일이 존재하지 않습니다.' });
    return;
  }

  let mimetype = file.mimetype;
  let ext = file.mimetype.split('/')[1];
  let name = file.originalname;
  let size = file.size;
  let src = `${process.env.APP_DOMAIN}/uploads/${dypth}/${file.filename}`;

  return { mimetype, ext, name, size, src };
};

const thumbnail = async (req, res, option) => {
  const { width, height } = option;

  await mkdirs('./uploads/' + dypth);

  try {
    await multerImage(req, res);
    await sharp(`./uploads/${dypth}/${req.file.filename}`)
      .resize(parseInt(width), parseInt(height))
      .toFile(`./uploads/${dypth}/th_${req.file.filename}`);
  } catch (error) {
    let message = error.message;
    if (message == 'File too large') {
      error.message = '이미지 파일 최대 허용 크기는 5MB입니다.';
    }
    throw error;
  }

  const { file } = req;

  if (!file) {
    res.status(500).json({ message: '파일이 존재하지 않습니다.' });
    return;
  }

  let mimetype = file.mimetype;
  let ext = file.mimetype.split('/')[1];
  let name = 'th_' + file.originalname;
  let size = file.size;
  let src = `${process.env.APP_DOMAIN}/uploads/${dypth}/th_${file.filename}`;

  return { mimetype, ext, name, size, src };
};

export default {
  file,
  image,
  thumbnail,
};
