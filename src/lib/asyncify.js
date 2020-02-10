import express from 'express';
import asyncify from 'express-asyncify';

export default function router() {
  return asyncify(express.Router());
}
