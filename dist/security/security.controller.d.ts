import { SecurityService } from './security.service';
import { SecurityProjectDto } from './dto/security-project.dto';
export declare class SecurityController {
    private readonly securityService;
    constructor(securityService: SecurityService);
    analyzeSecurity(securityProjectDto: SecurityProjectDto): Promise<{
        status: number;
        message: string;
        reportPath: string;
    }>;
}
