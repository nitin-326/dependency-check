import { Module } from '@nestjs/common';
import { DependencyService } from './dependency.service';
import { DependencyController } from './dependency.controller';

@Module({
  controllers: [DependencyController],
  providers: [DependencyService],
})
export class DependencyModule {}
