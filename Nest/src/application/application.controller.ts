import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Query,
    UploadedFile,
    UseInterceptors,
    Delete,
    Patch,
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ApplicationService } from './application.service';
  import { CompanyInformationDto } from './dto/create-application.dto';
  import { UpdateApplicationDto } from './dto/update-application.dto';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
  import { ConfigService } from '@nestjs/config';
  
  @Controller('applications')
  export class ApplicationController {
    constructor(
      private readonly applicationService: ApplicationService,
      private configService: ConfigService,
    ) {}
  
    @Post('company-info')
    createWithCompanyInfo(@Body() companyInfo: CompanyInformationDto) {
      return this.applicationService.createWithCompanyInfo(companyInfo);
    }
  
    @Patch(':id')
    // @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
    async update(
      @Param('id') id: string,
      @Body() updateApplicationDto: UpdateApplicationDto,
    ) {
      return this.applicationService.updateApplication(id, updateApplicationDto);
    }
  
    @Get()
    findAll(
      @Query('page') page: number = 1,
      @Query('limit') limit: number = 10,
      @Query('search') search?: string,
      @Query('sortField') sortField?: string,
      @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
      @Query() filters?: any,
    ) {
      return this.applicationService.findAll(
        page,
        limit,
        search,
        sortField,
        sortOrder,
        filters,
      );
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.applicationService.findOne(id);
    }
  
    @Post(':id/documents')
    @UseInterceptors(
      FileInterceptor('file', {
        storage: diskStorage({
          destination: './uploads',
          filename: (req, file, cb) => {
            const randomName = Array(32)
              .fill(null)
              .map(() => Math.round(Math.random() * 16).toString(16))
              .join('');
            return cb(null, `${randomName}${extname(file.originalname)}`);
          },
        }),
      }),
    )
    uploadDocument(
      @Param('id') applicationId: string,
      @UploadedFile() file: any,
    ) {
      return this.applicationService.uploadDocument(applicationId, file);
    }
  
    @Get(':id/documents')
    getDocuments(@Param('id') applicationId: string) {
      return this.applicationService.getDocuments(applicationId);
    }
  
    @Delete(':id/documents')
    removeAllDocuments(@Param('id') applicationId: string) {
      return this.applicationService.removeAllDocuments(applicationId);
    }
  }