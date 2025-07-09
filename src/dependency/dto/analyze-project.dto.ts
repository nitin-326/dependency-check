// analyze-project.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AnalyzeProjectDto {
  @ApiProperty({
    example: '/path/to/project',
    description: 'Path to the project directory',
  })
  @IsString()
  @IsNotEmpty()
  projectPath: string;
}
