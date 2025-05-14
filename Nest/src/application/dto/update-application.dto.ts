import { IsEmail, IsPhoneNumber, IsBoolean, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UpdateCompanyInformationDto {
  @IsOptional()
  @IsString()
  companyUEN?: string;

  @IsOptional()
  @IsString()
  companyName?: string;
}

class UpdateApplicationInformationDto {
  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsString()
  position?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsEmail()
  reEnterEmail?: string;

  @IsOptional()
  @IsPhoneNumber()
  mobileNumber?: string;
}

class UpdateTermsAndConditionsDto {
  @IsOptional()
  @IsBoolean()
  termsAccepted?: boolean;
}

export class UpdateApplicationDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateCompanyInformationDto)
  companyInformation?: UpdateCompanyInformationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateApplicationInformationDto)
  applicationInformation?: UpdateApplicationInformationDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateTermsAndConditionsDto)
  termsAndConditions?: UpdateTermsAndConditionsDto;
}