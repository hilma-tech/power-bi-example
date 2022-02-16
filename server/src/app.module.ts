import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PowerbiModule } from './powerbi/powerbi.module';

@Module({
  imports: [PowerbiModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
