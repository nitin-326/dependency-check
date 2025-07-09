import { Body, Controller, Post } from '@nestjs/common';
import { DependencyService } from './dependency.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AnalyzeProjectDto } from './dto/analyze-project.dto';

@Controller('dependency')
@ApiTags('Dependency')
export class DependencyController {
  constructor(private readonly dependencyService: DependencyService) {}

  @Post('analyze')
  async analyzeProject(@Body() analyzeProjectDto: AnalyzeProjectDto) {
    const reportPath = await this.dependencyService.analyzeDependencies(
      analyzeProjectDto.projectPath,
    );
    return {
      status:200,
      message: 'Dependency analysis completed',
      reportPath,
    };
  }
}
