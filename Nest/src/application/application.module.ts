import { Module } from '@nestjs/common';
import { ApplicationService } from './application.service';
import { ApplicationController } from './application.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from './entities/application.entity';
import { Document } from './entities/document.entity';
import { PdfValidatorService } from 'src/common/pdf-validator-service';

@Module({
  imports: [TypeOrmModule.forFeature([Application, Document])],
  controllers: [ApplicationController],
  providers: [ApplicationService, PdfValidatorService],
})
export class ApplicationModule {}