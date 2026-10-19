import 'dotenv/config';
// import { mkdirSync } from 'node:fs';
// import { resolve } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

// mkdirSync(resolve('prisma/data'), { recursive: true });

const app = await NestFactory.create(AppModule);
const corsOrigins = (process.env.CORS_ORIGINS ?? '')
  .split(',')
  .map((origin) => origin.trim())
  .filter((origin) => origin.length > 0);

app.enableCors({ origin: corsOrigins });
await app.listen(Number(process.env.PORT ?? 3000));
