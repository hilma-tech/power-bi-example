import { Controller, Get } from '@nestjs/common';
import { PowerbiService } from './powerbi.service';

@Controller('/api/powerbi')
export class PowerbiController {
    constructor(
        private readonly powerBiService: PowerbiService
    ) { }

    @Get()
    getPowerBiStatistics(): Promise<{ id: string, embedUrl: string, embedToken: string }> {
        return this.powerBiService.getPowerBiStatistics();
    }
}
