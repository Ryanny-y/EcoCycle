import config from './config/index'
import express from 'express';

const app = express();


app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});