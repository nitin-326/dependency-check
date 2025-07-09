import { ConfigService } from '@nestjs/config';
export declare class SecurityService {
    private configService;
    constructor(configService: ConfigService);
    analyzeSecurity(projectPath: string): Promise<string>;
    private runNodeAudit;
}
