import { ConfigService } from '@nestjs/config';
export declare class DependencyService {
    private configService;
    constructor(configService: ConfigService);
    analyzeDependencies(projectPath: string): Promise<string>;
}
