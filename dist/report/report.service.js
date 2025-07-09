"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportService = void 0;
const common_1 = require("@nestjs/common");
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
let ReportService = class ReportService {
    async generateReport(projectPath, reportType) {
        const dependencyReport = path.join(projectPath, 'dependency_report.json');
        const securityReport = path.join(projectPath, 'final_security_report.json');
        if (!fs.existsSync(dependencyReport) || !fs.existsSync(securityReport)) {
            throw new common_1.NotFoundException('Reports not found. Please run analysis first.');
        }
        const dependencyData = JSON.parse(fs.readFileSync(dependencyReport, 'utf-8'));
        const securityData = JSON.parse(fs.readFileSync(securityReport, 'utf-8'));
        const combinedReport = this.combineReports(dependencyData, securityData);
        if (reportType === 'json') {
            return this.generateJsonReport(projectPath, combinedReport);
        }
        else if (reportType === 'pdf') {
            return this.generatePdfReport(projectPath, combinedReport);
        }
        else {
            throw new common_1.BadRequestException('Invalid report type.');
        }
    }
    async combineReports(dependencyData, securityData) {
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
    async generateJsonReport(projectPath, combinedReport) {
        const finalReport = {
            project: projectPath,
            dependencies: combinedReport,
            summary: this.generateSummary(combinedReport),
        };
        const reportPath = path.join(projectPath, 'final_report.json');
        fs.writeFileSync(reportPath, JSON.stringify(finalReport, null, 2));
        return reportPath;
    }
    async generatePdfReport(projectPath, combinedReport) {
        const doc = new PDFDocument();
        const reportPath = path.join(projectPath, 'final_report.pdf');
        const writeStream = fs.createWriteStream(reportPath);
        doc.pipe(writeStream);
        doc.fontSize(20).text('Dependency & Security Report', { align: 'center' });
        doc.moveDown(2);
        doc.fontSize(14).text(`Project Path: ${projectPath}`);
        doc.moveDown(1);
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
            }
            else {
                doc.fontSize(12).text(`  - No known vulnerabilities`);
            }
            doc.moveDown(0.5);
        });
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
    generateSummary(combinedReport) {
        const totalDependencies = combinedReport.length;
        const outdated = combinedReport.filter((dep) => dep.currentVersion !== dep.latestVersion).length;
        const vulnerabilities = combinedReport.filter((dep) => dep.vulnerabilities !== 'No known vulnerabilities').length;
        return (`Total Dependencies: ${totalDependencies}\n` +
            `Outdated Dependencies: ${outdated}\n` +
            `Dependencies with Vulnerabilities: ${vulnerabilities}`);
    }
};
exports.ReportService = ReportService;
exports.ReportService = ReportService = __decorate([
    (0, common_1.Injectable)()
], ReportService);
//# sourceMappingURL=report.service.js.map