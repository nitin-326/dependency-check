import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as PDFDocument from 'pdfkit';

@Injectable()
export class ReportService {
  async generateReport(projectPath: string, reportType: 'json' | 'pdf') {
    const dependencyReport = path.join(projectPath, 'dependency_report.json');
    const securityReport = path.join(projectPath, 'final_security_report.json');

    if (!fs.existsSync(dependencyReport) || !fs.existsSync(securityReport)) {
      throw new NotFoundException(
        'Reports not found. Please run analysis first.',
      );
    }

    const dependencyData = JSON.parse(
      fs.readFileSync(dependencyReport, 'utf-8'),
    );
    const securityData = JSON.parse(fs.readFileSync(securityReport, 'utf-8'));

    // Combine the reports into a unified format
    const combinedReport = this.combineReports(dependencyData, securityData);

    if (reportType === 'json') {
      return this.generateJsonReport(projectPath, combinedReport);
    } else if (reportType === 'pdf') {
      return this.generatePdfReport(projectPath, combinedReport);
    } else {
      throw new BadRequestException('Invalid report type.');
    }
  }

  async combineReports(dependencyData: any, securityData: any) {
    // Merge the two reports by dependency name
    const combined = Object.keys(dependencyData).map((depName) => {
      const dependency = dependencyData[depName];
      const security = securityData[depName] || [];

      return {
        name: depName,
        currentVersion: dependency.current,
        latestVersion: dependency.latest,
        updateCommand: dependency.updateCommand,
        vulnerabilities: security.length
          ? security
          : 'No known vulnerabilities',
      };
    });

    return combined;
  }

  async generateJsonReport(projectPath: string, combinedReport: any) {
    const finalReport = {
      project: projectPath,
      dependencies: combinedReport,
      summary: this.generateSummary(combinedReport),
    };

    const reportPath = path.join(projectPath, 'final_report.json');
    fs.writeFileSync(reportPath, JSON.stringify(finalReport, null, 2));
    return reportPath;
  }

  async generatePdfReport(projectPath: string, combinedReport: any) {
    const doc = new PDFDocument();
    const reportPath = path.join(projectPath, 'final_report.pdf');
    const writeStream = fs.createWriteStream(reportPath);
    doc.pipe(writeStream);

    // PDF Title
    doc.fontSize(20).text('Dependency & Security Report', { align: 'center' });
    doc.moveDown(2);

    // Project Details
    doc.fontSize(14).text(`Project Path: ${projectPath}`);
    doc.moveDown(1);

    // Dependencies Analysis
    doc
      .fontSize(16)
      .text('Dependency Analysis & Security:', { underline: true });
    combinedReport.forEach((dep) => {
      doc
        .fontSize(12)
        .text(`- ${dep.name}: ${dep.currentVersion} ➔ ${dep.latestVersion}`);
      doc.fontSize(12).text(`  Update Command: ${dep.updateCommand}`);
      if (dep.vulnerabilities !== 'No known vulnerabilities') {
        dep.vulnerabilities.forEach((vul) => {
          doc.fontSize(12).text(`  - ${vul.cve}: ${vul.severity}`);
        });
      } else {
        doc.fontSize(12).text(`  - No known vulnerabilities`);
      }
      doc.moveDown(0.5);
    });

    // Summary
    doc.moveDown(1);
    doc.fontSize(16).text('Summary:', { underline: true });
    doc.fontSize(12).text(this.generateSummary(combinedReport));

    doc.end();

    return new Promise((resolve) => {
      writeStream.on('finish', () => {
        resolve(reportPath);
      });
    });
  }

  private generateSummary(combinedReport: any): string {
    const totalDependencies = combinedReport.length;
    const outdated = combinedReport.filter(
      (dep) => dep.currentVersion !== dep.latestVersion,
    ).length;
    const vulnerabilities = combinedReport.filter(
      (dep) => dep.vulnerabilities !== 'No known vulnerabilities',
    ).length;

    return (
      `Total Dependencies: ${totalDependencies}\n` +
      `Outdated Dependencies: ${outdated}\n` +
      `Dependencies with Vulnerabilities: ${vulnerabilities}`
    );
  }
}
