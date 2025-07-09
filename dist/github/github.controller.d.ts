import { GithubService } from './github.service';
export declare class GithubController {
    private readonly githubService;
    constructor(githubService: GithubService);
    downloadRepo(owner: string, repo: string, branch: string, accessToken: string): Promise<{
        status: number;
        message: string;
        path: string;
    }>;
}
