import express from 'express';

const app = express();

app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'API Catalog está rodando!' });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

export default app;
