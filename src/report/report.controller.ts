import { Body, Controller, Post } from '@nestjs/common';
import { ReportService } from './report.service';
import { GenerateReportDto } from './dto/generate-report.dto';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Post('generate')
  async generateReport(@Body() body: GenerateReportDto) {
    const { projectPath, reportType } = body;
    const reportPath = await this.reportService.generateReport(
      projectPath,
      reportType,
    );
    return {
      status: 200,
      message: 'Report generated successfully',
      reportPath,
    };
  }
}
