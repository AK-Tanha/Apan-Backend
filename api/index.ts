import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';
import { ResponseInterceptor } from '../src/common/interceptors/response.interceptor';
import express from 'express';

const server = express();

const SWAGGER_CDN = 'https://unpkg.com/swagger-ui-dist@5.32.8';

const swaggerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Apan Apparel API - Swagger UI</title>
  <link rel="stylesheet" type="text/css" href="${SWAGGER_CDN}/swagger-ui.css" />
  <link rel="icon" type="image/png" href="${SWAGGER_CDN}/favicon-32x32.png" sizes="32x32" />
  <link rel="icon" type="image/png" href="${SWAGGER_CDN}/favicon-16x16.png" sizes="16x16" />
  <style>
    html { box-sizing: border-box; overflow-y: scroll; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin: 0; background: #fafafa; }
  </style>
</head>
<body>
  <div id="swagger-ui"></div>
  <script src="${SWAGGER_CDN}/swagger-ui-bundle.js"></script>
  <script src="${SWAGGER_CDN}/swagger-ui-standalone-preset.js"></script>
  <script>
    window.onload = function () {
      window.ui = SwaggerUIBundle({
        url: '/api/docs-json',
        dom_id: '#swagger-ui',
        deepLinking: true,
        displayRequestDuration: true,
        presets: [SwaggerUIBundle.presets.apis, SwaggerUIStandalonePreset],
        layout: 'StandaloneLayout',
      });
    };
  </script>
</body>
</html>`;

let cachedApp: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Apan Apparel API')
    .setDescription('Backend API for Court Classic / Apan Apparel storefront')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  server.get('/api/docs-json', (req, res) => res.json(document));
  server.get('/api/docs', (req, res) => res.type('html').send(swaggerHtml));
  server.get('/api/docs/', (req, res) => res.type('html').send(swaggerHtml));

  await app.init();
  return app;
}

export default async function handler(req: any, res: any) {
  if (!cachedApp) {
    cachedApp = await bootstrap();
  }
  server(req, res);
}
