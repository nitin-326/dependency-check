import { Body, Controller, Post } from '@nestjs/common';
import { SecurityService } from './security.service';
import { ApiTags } from '@nestjs/swagger';
import { SecurityProjectDto } from './dto/security-project.dto';

@Controller('security')
@ApiTags('Security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  @Post('analyze')
  async analyzeSecurity(@Body() securityProjectDto: SecurityProjectDto) {
    const reportPath = await this.securityService.analyzeSecurity(
      securityProjectDto.projectPath,
    );
    return {
      status: 200,
      message: 'Security analysis completed',
      reportPath,
    };
  }
}
