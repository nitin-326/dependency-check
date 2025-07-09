import { DependencyService } from './dependency.service';
import { AnalyzeProjectDto } from './dto/analyze-project.dto';
export declare class DependencyController {
    private readonly dependencyService;
    constructor(dependencyService: DependencyService);
    analyzeProject(analyzeProjectDto: AnalyzeProjectDto): Promise<{
        status: number;
        message: string;
        reportPath: string;
    }>;
}
