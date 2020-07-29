import express from 'express';

import member from './member';
import upload from './upload';
import visit from './visit';
import history from './history';
import schedule from './schedule';
import project from './project';
import task from './task';
import board from './board';
import editor from './editor';
import lecture from './lecture';

import partner from './partner';
import banner from './banner';

const router = express.Router();

router.use('/upload', upload);
router.use('/member', member);
router.use('/visit', visit);
router.use('/history', history);
router.use('/schedule', schedule);
router.use('/project', project);
router.use('/task', task);
router.use('/board', board);
router.use('/editor', editor);
router.use('/lecture', lecture);

export default router;
