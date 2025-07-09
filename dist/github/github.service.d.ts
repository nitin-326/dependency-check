import { HttpService } from '@nestjs/axios';
export declare class GithubService {
    private readonly httpService;
    constructor(httpService: HttpService);
    private readonly githubApiUrl;
    private readonly logger;
    downloadRepo(owner: string, repo: string, branch?: string, accessToken?: string): Promise<string>;
}
