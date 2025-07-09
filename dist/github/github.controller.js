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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GithubController = void 0;
const common_1 = require("@nestjs/common");
const github_service_1 = require("./github.service");
const swagger_1 = require("@nestjs/swagger");
let GithubController = class GithubController {
    constructor(githubService) {
        this.githubService = githubService;
    }
    async downloadRepo(owner, repo, branch, accessToken) {
        const path = await this.githubService.downloadRepo(owner, repo, branch, accessToken);
        return { status: 200, message: 'Repository downloaded successfully', path };
    }
};
exports.GithubController = GithubController;
__decorate([
    (0, common_1.Get)('download'),
    __param(0, (0, common_1.Query)('owner')),
    __param(1, (0, common_1.Query)('repo')),
    __param(2, (0, common_1.Query)('branch')),
    __param(3, (0, common_1.Query)('accessToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", Promise)
], GithubController.prototype, "downloadRepo", null);
exports.GithubController = GithubController = __decorate([
    (0, common_1.Controller)('github'),
    (0, swagger_1.ApiTags)('Github'),
    __metadata("design:paramtypes", [github_service_1.GithubService])
], GithubController);
//# sourceMappingURL=github.controller.js.map