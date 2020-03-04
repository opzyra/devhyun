import express from 'express';

import api from './api';
import admin from './admin';
import client from './client';

const router = express.Router();

// router.use('/api', api);
router.use('/admin', admin);
router.use('/', client);

export default router;
