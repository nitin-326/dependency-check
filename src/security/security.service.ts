import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { exec, execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class SecurityService {
  constructor(private configService: ConfigService) {}

  async analyzeSecurity(projectPath: string): Promise<string> {
    const pythonCommand =
      this.configService.get<string>('PYTHON_COMMAND') || 'python';
    const finalReportPath = path.join(projectPath, 'security_report.json');

    const reportData: any = {};

    if (!fs.existsSync(projectPath)) {
      throw new HttpException(
        'Project path does not exist',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Run Node.js Security Scan (OWASP Dependency Check)
    if (fs.existsSync(path.join(projectPath, 'package.json'))) {
      try {
        const nodeReport = await this.runNodeAudit(projectPath);
        reportData.node_security = nodeReport;
      } catch (error) {
        console.error('Node.js Security Scan Failed:', error.message);
      }
    } else {
      console.log(
        'No Node.js package.json found. Skipping Node.js security scan.',
      );
    }

    // Save Final Combined Report
    fs.writeFileSync(finalReportPath, JSON.stringify(reportData, null, 2));
    console.log(`Final Security Report generated: ${finalReportPath}`);

    return finalReportPath;
  }

  private async runNodeAudit(projectPath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const lockFilePath = path.join(projectPath, 'package-lock.json');
      const nodeModulesPath = path.join(projectPath, 'node_modules');

      // Ensure lock file exists
      if (!fs.existsSync(lockFilePath)) {
        return reject(
          new Error(
            'Lock file not found. Please ensure package-lock.json is present.',
          ),
        );
      }

      // Ensure node_modules exists (dependencies are installed)
      if (!fs.existsSync(nodeModulesPath)) {
        console.log('No node_modules folder found. Installing dependencies...');
        try {
          execSync('npm install', { cwd: projectPath, stdio: 'inherit' });
        } catch (installError) {
          return reject(new Error('Failed to install dependencies.'));
        }
      }

      const auditCommand = `npm audit --json`;
      exec(auditCommand, { cwd: projectPath }, (error, stdout, stderr) => {
        if (stderr) {
          console.error('Error (stderr):', stderr);
        }

        // If there is an error but stdout is present, it's likely due to vulnerabilities
        if (stdout) {
          try {
            const reportData = JSON.parse(stdout);
            return resolve(reportData);
          } catch (parseError) {
            return reject(
              new Error('Failed to parse Node.js security report.'),
            );
          }
        }

        // If error without stdout, then it's a real command failure
        if (error) {
          console.error('Error (stderr):', stderr);
          return reject(
            new Error(
              `Node.js Security Scan Error: ${stderr || error.message}`,
            ),
          );
        }

        return reject(
          new Error('Unexpected error during Node.js security scan.'),
        );
      });
    });
  }
}
