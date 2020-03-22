import asyncify from '@/lib/asyncify';
import session from '@/lib/session';
import upload from '@/lib/upload';

import validator, { Joi } from '@/middleware/validator';

import Upload from '@/models/Upload';

const controller = asyncify();

export const uploadFile = controller.post(
  '/file',
  session.isAdmin(),
  async (req, res, transaction) => {
    let file;
    try {
      file = await upload.file(req, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
      return;
    }

    const uploaded = await Upload.insertOne(file)(transaction);

    res.status(200).json({
      idx: uploaded.idx,
      name: file.name,
      src: file.src,
      originalFilename: file.name,
    });
  },
);

export const uploadImage = controller.post(
  '/image',
  session.isAdmin(),
  async (req, res, transaction) => {
    let file;
    try {
      file = await upload.image(req, res);
    } catch (error) {
      res.status(500).json({ message: error.message });
      return;
    }

    await Upload.insertOne(file)(transaction);

    res.status(200).json({ name: file.name, src: file.src });
  },
);

export const uploadThumbnail = controller.post(
  '/thumbnail',
  session.isAdmin(),
  validator.query({
    width: Joi.number().required(),
    height: Joi.number().required(),
  }),
  async (req, res, transaction) => {
    const { width, height } = req.query;
    let file;
    try {
      file = await upload.thumbnail(req, res, { width, height });
    } catch (error) {
      res.status(500).json({ message: error.message });
      return;
    }

    await Upload.insertOne(file)(transaction);

    res.status(200).json({ name: file.name, src: file.src });
  },
);

export default controller.router;
