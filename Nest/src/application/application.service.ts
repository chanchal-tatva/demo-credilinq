import { BadRequestException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Application } from './entities/application.entity';
import { Document } from './entities/document.entity';
import { CompanyInformationDto } from './dto/create-application.dto';
import { UpdateApplicationDto } from './dto/update-application.dto';
import * as fs from 'fs';
import * as path from 'path';
import { PdfValidatorService } from 'src/common/pdf-validator-service';

@Injectable()
export class ApplicationService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
    @InjectRepository(Document)
    private documentRepository: Repository<Document>,
    private pdfValidator: PdfValidatorService,
  ) {}

  async createWithCompanyInfo(companyInformation: CompanyInformationDto) {
    const application = this.applicationRepository.create({
      companyUEN: companyInformation.companyUEN,
      companyName: companyInformation.companyName,
    });
    return await this.applicationRepository.save(application);
  }

  async updateApplication(id: string, updateApplicationDto: UpdateApplicationDto) {
    const application = await this.findOne(id);

    if (updateApplicationDto.companyInformation) {
      application.companyUEN = updateApplicationDto.companyInformation.companyUEN || application.companyUEN;
      application.companyName = updateApplicationDto.companyInformation.companyName || application.companyName;
    }

    if (updateApplicationDto.applicationInformation) {
      if (updateApplicationDto.applicationInformation.email && 
          updateApplicationDto.applicationInformation.reEnterEmail &&
          updateApplicationDto.applicationInformation.email !== updateApplicationDto.applicationInformation.reEnterEmail) {
        throw new Error('Emails do not match');
      }

      application.fullName = updateApplicationDto.applicationInformation.fullName || application.fullName;
      application.position = updateApplicationDto.applicationInformation.position || application.position;
      application.email = updateApplicationDto.applicationInformation.email || application.email;
      application.mobileNumber = updateApplicationDto.applicationInformation.mobileNumber || application.mobileNumber;
    }

    if (updateApplicationDto.termsAndConditions) {
      application.termsAccepted = updateApplicationDto.termsAndConditions.termsAccepted ?? application.termsAccepted;
    }

    return await this.applicationRepository.save(application);
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    search?: string,
    sortField?: string,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
    filters?: Record<string, any>,
  ) {
    try {
      const skip = (page - 1) * limit;
      
      // Define allowed columns to prevent SQL injection
      const allowedColumns = [
        'id',
        'companyUEN',
        'companyName',
        'fullName',
        'position',
        'email',
        'createdAt',
        'updatedAt'
      ];

      // Validate sortField
      if (sortField && !allowedColumns.includes(sortField)) {
        throw new Error(`Invalid sort field: ${sortField}`);
      }

      // Create query builder
      const query = this.applicationRepository
        .createQueryBuilder('application')
        .select(allowedColumns.map(col => `application.${col}`));

      // Apply search
      if (search) {
        query.where(
          '(application.companyUEN LIKE :search OR ' +
          'application.companyName LIKE :search OR ' +
          'application.fullName LIKE :search OR ' +
          'application.position LIKE :search OR ' +
          'application.email LIKE :search)',
          { search: `%${search}%` }
        );
      }

      // Apply filters
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            if (key === 'createdAt' || key === 'updatedAt') {
              if (value.from && value.to) {
                query.andWhere(`application.${key} BETWEEN :from AND :to`, {
                  from: value.from,
                  to: value.to
                });
              }
            } else if (allowedColumns.includes(key)) {
              query.andWhere(`application.${key} = :${key}`, { [key]: value });
            }
          }
        });
      }

      // Apply sorting
      if (sortField) {
        query.orderBy(`application.${sortField}`, sortOrder);
      } else {
        query.orderBy('application.createdAt', sortOrder);
      }

      // Execute paginated query
      const [data, total] = await query
        .skip(skip)
        .take(limit)
        .getManyAndCount();

      return {
        data,
        total,
        page,
        last_page: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error('Error in findAll:', error);
      throw new InternalServerErrorException(error.message);
    }
  }



  async findOne(id: string) {
    const application = await this.applicationRepository.findOne({
      where: { id },
      relations: ['documents'],
    });

    if (!application) {
      throw new NotFoundException('Application not found');
    }

    return application;
  }

  async uploadDocument(applicationId: string, file:  any) {
    const application = await this.findOne(applicationId);
    console.log('file', file)
    if (file.mimetype === 'application/pdf') {

      console.log("Abbccd")
      const { isValid } = await this.pdfValidator.validateBankStatement(
        file.path,
        '01-05-2024', // Start date (01 May 2024)
        '31-10-2024'  // End date (31 October 2024)
      );
      if (!isValid) {
        // Delete the invalid file
        fs.unlinkSync(file.path);
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_ACCEPTABLE,
            message: '*Uploaded statement is detected as scanned. Please upload native PDF statement.',
            error: 'Conflict',
            details: {
              ...file,
              error: true
            },
          },
          HttpStatus.CONFLICT,
        );
      }
    }
    const document = this.documentRepository.create({
      filename: file.filename,
      path: file.path,
      originalname: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      application,
    });

    return await this.documentRepository.save(document);
  }

  async getDocuments(applicationId: string) {
    const application = await this.findOne(applicationId);
    return application.documents;
  }

  async removeAllDocuments(applicationId: string) {
    const application = await this.findOne(applicationId);
    const documents = application.documents;

    documents.forEach((doc) => {
      try {
        fs.unlinkSync(doc.path);
      } catch (err) {
        console.error(`Error deleting file ${doc.path}:`, err);
      }
    });

    await this.documentRepository.remove(documents);

    return { message: 'All documents deleted successfully' };
  }
}