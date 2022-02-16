import { ConfidentialClientApplication } from '@azure/msal-node';
import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { config } from '../config';

@Injectable()
export class PowerbiService {
    private readonly cca: ConfidentialClientApplication;

    constructor(
        private readonly httpService: HttpService
    ) {
        this.cca = new ConfidentialClientApplication({
            auth: {
                clientId: config.clientId,
                clientSecret: config.clientSecret,
                authority: `https://login.microsoftonline.com/${config.tenantId}`
            }
        });
    }

    private async getAuthHeaders(): Promise<{ Authorization: string, ['Content-Type']: string, responseType: string }> {
        try {
            const authRes = await this.cca.acquireTokenByClientCredential({
                scopes: ["https://analysis.windows.net/powerbi/api/.default"]
            });

            const { accessToken } = authRes;

            return {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': "application/json",
                responseType: "application/json"
            };
        } catch (err) {
            console.error("could not generate auth headers for power bi");
            console.error(err);
            throw new InternalServerErrorException();
        }
    }

    async getPowerBiStatistics(): Promise<{ id: string, embedUrl: string, embedToken: string }> {
        const headers = await this.getAuthHeaders();

        try {
            const getEmbedUrl = `https://api.powerbi.com/v1.0/myorg/groups/${config.workspaceId}/reports/${config.reportId}`;

            const embedObservable = this.httpService.get<{ embedUrl: string, datasetId: string, id: string }>(getEmbedUrl, { headers });
            const embedRes = await lastValueFrom(embedObservable);

            const getTokenUrl = "https://api.powerbi.com/v1.0/myorg/GenerateToken";

            const getTokenData = {
                reports: [
                    {
                        id: config.reportId,
                        allowEdit: false
                    }
                ],
                datasets: [
                    { id: embedRes.data.datasetId }
                ],
                targetWorkspaces: [
                    { id: config.workspaceId }
                ]
            };

            const tokenObservable = this.httpService.post<{ token: string }>(getTokenUrl, JSON.stringify(getTokenData), { headers });
            const tokenRes = await lastValueFrom(tokenObservable);

            return {
                id: embedRes.data.id,
                embedUrl: embedRes.data.embedUrl,
                embedToken: tokenRes.data.token
            }
        } catch (err) {
            console.error("could not get data for admin statistics");
            console.error(err);
            throw new InternalServerErrorException();
        }
    }
}
