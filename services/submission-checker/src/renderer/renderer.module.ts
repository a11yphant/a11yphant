import { Module } from '@nestjs/common';
import { RendererController } from './renderer.controller';

@Module({
  providers: [],
  controllers: [RendererController],
})
export class RendererModule {}
