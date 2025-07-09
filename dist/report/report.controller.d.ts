import { ReportService } from './report.service';
import { GenerateReportDto } from './dto/generate-report.dto';
export declare class ReportController {
    private readonly reportService;
    constructor(reportService: ReportService);
    generateReport(body: GenerateReportDto): Promise<{
        status: number;
        message: string;
        reportPath: unknown;
    }>;
}
