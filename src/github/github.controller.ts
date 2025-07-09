import { Controller, Get, Query } from '@nestjs/common';
import { GithubService } from './github.service';
import { ApiTags } from '@nestjs/swagger';


@Controller('github')
@ApiTags('Github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Get('download')
  async downloadRepo(
    @Query('owner') owner: string,
    @Query('repo') repo: string,
    @Query('branch') branch: string,
    @Query('accessToken') accessToken: string,
  ) {
    const path = await this.githubService.downloadRepo(
      owner,
      repo,
      branch,
      accessToken,
    );
    return { status: 200, message: 'Repository downloaded successfully', path };
  }
}
