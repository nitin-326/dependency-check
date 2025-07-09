import { Injectable, NotFoundException } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DependencyService {
  constructor(private configService: ConfigService) {}

  async analyzeDependencies(projectPath: string) {
    const scriptPath = path.join(
      __dirname,
      '../../python-scripts/dependency_analyzer.py',
    );

    const pythonCommand =
      this.configService.get<string>('PYTHON_COMMAND') || 'python';

    if (!fs.existsSync(projectPath)) {
      throw new NotFoundException('Project path does not exist');
    }
    console.log(projectPath);
    return new Promise<string>((resolve, reject) => {
      exec(
        `${pythonCommand} ${scriptPath} "${projectPath}"`,
        (error, stdout, stderr) => {
          if (error) {
            console.log("error --------------->>>>>>>>>>>", error)
            reject(`Error analyzing dependencies: ${stderr}`);
            return;
          }

          const reportPath = path.join(projectPath, 'dependency_report.json');
          if (!fs.existsSync(reportPath)) {
            reject('Dependency report not generated');
            return;
          }

          resolve(reportPath);
        },
      );
    });
  }
}
