import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import getConfig from './config/configuration';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { WsAdapter } from './realtime/server';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = getConfig();

  const documentConfig = new DocumentBuilder()
    .setTitle('Tana AI API')
    .setDescription('The Tana API description')
    .setVersion('1.0')
    .addTag('users')
    .addTag('auth')
    .addTag('chat')
    .build();
  const document = SwaggerModule.createDocument(app, documentConfig);
  SwaggerModule.setup('docs', app, document);

  app.useWebSocketAdapter(new WsAdapter(app));
  app.enableCors({ origin: '*' });

  await app.listen(config.port);
}
bootstrap();
