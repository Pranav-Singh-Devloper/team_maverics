import express from 'express';
import cors from 'cors';
import { PORT } from './config/config.js';
import { initPinecone } from './services/services.js';
import apiRoutes from './routes/api.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);
app.use('/', apiRoutes); // For backward compatibility with /health

async function start() {
  await initPinecone();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();