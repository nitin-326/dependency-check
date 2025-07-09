"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var GithubService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubService = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const path = require("path");
const fs = require("fs");
let GithubService = GithubService_1 = class GithubService {
    constructor(httpService) {
        this.httpService = httpService;
        this.githubApiUrl = 'https://api.github.com';
        this.logger = new common_1.Logger(GithubService_1.name);
    }
    async downloadRepo(owner, repo, branch = 'main', accessToken) {
        const headers = {
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
        }
        catch (err) {
            this.logger.warn(`Direct fetch failed. Falling back to ZIP method: ${err.message}`);
        }
        return extractPath;
    }
};
exports.GithubService = GithubService;
exports.GithubService = GithubService = GithubService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService])
], GithubService);
//# sourceMappingURL=github.service.js.map