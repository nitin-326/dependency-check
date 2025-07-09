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
exports.DependencyController = void 0;
const common_1 = require("@nestjs/common");
const dependency_service_1 = require("./dependency.service");
const swagger_1 = require("@nestjs/swagger");
const analyze_project_dto_1 = require("./dto/analyze-project.dto");
let DependencyController = class DependencyController {
    constructor(dependencyService) {
        this.dependencyService = dependencyService;
    }
    async analyzeProject(analyzeProjectDto) {
        const reportPath = await this.dependencyService.analyzeDependencies(analyzeProjectDto.projectPath);
        return {
            status: 200,
            message: 'Dependency analysis completed',
            reportPath,
        };
    }
};
exports.DependencyController = DependencyController;
__decorate([
    (0, common_1.Post)('analyze'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [analyze_project_dto_1.AnalyzeProjectDto]),
    __metadata("design:returntype", Promise)
], DependencyController.prototype, "analyzeProject", null);
exports.DependencyController = DependencyController = __decorate([
    (0, common_1.Controller)('dependency'),
    (0, swagger_1.ApiTags)('Dependency'),
    __metadata("design:paramtypes", [dependency_service_1.DependencyService])
], DependencyController);
//# sourceMappingURL=dependency.controller.js.map