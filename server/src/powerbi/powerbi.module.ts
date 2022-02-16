import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PowerbiController } from './powerbi.controller';
import { PowerbiService } from './powerbi.service';

@Module({
  imports: [HttpModule],
  controllers: [PowerbiController],
  providers: [PowerbiService]
})
export class PowerbiModule { }
