export declare class ReportService {
    generateReport(projectPath: string, reportType: 'json' | 'pdf'): Promise<unknown>;
    combineReports(dependencyData: any, securityData: any): Promise<{
        name: string;
        currentVersion: any;
        latestVersion: any;
        updateCommand: any;
        vulnerabilities: any;
    }[]>;
    generateJsonReport(projectPath: string, combinedReport: any): Promise<string>;
    generatePdfReport(projectPath: string, combinedReport: any): Promise<unknown>;
    private generateSummary;
}
