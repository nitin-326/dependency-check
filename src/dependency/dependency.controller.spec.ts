import { Test, TestingModule } from '@nestjs/testing';
import { DependencyController } from './dependency.controller';
import { DependencyService } from './dependency.service';

describe('DependencyController', () => {
  let controller: DependencyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DependencyController],
      providers: [DependencyService],
    }).compile();

    controller = module.get<DependencyController>(DependencyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
