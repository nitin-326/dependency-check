import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
import * as unzipper from 'unzipper';

@Injectable()
export class GithubService {
  constructor(private readonly httpService: HttpService) {}

  private readonly githubApiUrl = 'https://api.github.com';
  private readonly logger = new Logger(GithubService.name);

  async downloadRepo(
    owner: string,
    repo: string,
    branch = 'main',
    accessToken?: string,
  ) {
    const headers: any = {
      Accept: 'application/vnd.github.v3+json',
    };
    if (accessToken) {
      headers['Authorization'] = `token ${accessToken}`;
    }

    const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/package.json`;

    const filesToFetch = [
      'package.json',
      'package-lock.json',
      'requirement.txt',
    ];

    const extractPath = path.join(__dirname, '../../downloads', repo);

    try {
      fs.mkdirSync(extractPath, { recursive: true });

      for (const file of filesToFetch) {
        const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${file}`;
        const response = await this.httpService.axiosRef.get(rawUrl, {
          headers,
        });
        if (response) {
          const filePath = path.join(extractPath, file);
          fs.writeFileSync(filePath, JSON.stringify(response.data, null, 2));
          this.logger.log(`Fetched: ${filePath}`);
        }
      }

      return extractPath;
    } catch (err) {
      this.logger.warn(
        `Direct fetch failed. Falling back to ZIP method: ${err.message}`,
      );
    }

    return extractPath;
  }
}
