import express from 'express';

import client from './client';
import admin from './admin';
import sessionCtx from '../core/session';

const router = express.Router();

router.use('/admin', sessionCtx.isAdmin(), admin);
router.use('/', client);

export default router;
