import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
const router = express.Router();

// create a proxy for  events microservice
const eventsProxy = createProxyMiddleware({
  target: 'http://msevents:3010',
  changeOrigin: true,
});


router.use('/events', eventsProxy);

export default router;
