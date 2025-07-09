// generate-report.dto.ts
import { IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GenerateReportDto {
  @ApiProperty({
    example: '/path/to/project',
    description: 'Path to the project directory',
  })
  @IsString()
  projectPath: string;

  @ApiProperty({
    example: 'json',
    description: 'Type of report to generate',
    enum: ['json', 'pdf'],
  })
  @IsString()
  @IsIn(['json', 'pdf'])
  reportType: 'json' | 'pdf';
}
