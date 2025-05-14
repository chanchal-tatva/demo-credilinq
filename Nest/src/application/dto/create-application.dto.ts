import { IsNotEmpty, IsEmail, IsPhoneNumber, IsBoolean, IsString } from 'class-validator';

export class CompanyInformationDto {
  @IsNotEmpty()
  @IsString()
  companyUEN: string;

  @IsNotEmpty()
  @IsString()
  companyName: string;
}

export class ApplicationInformationDto {
//   @IsNotEmpty()
  fullName: string;

//   @IsNotEmpty()
  position: string;

//   @IsNotEmpty()
  @IsEmail()
  email: string;

//   @IsNotEmpty()
  @IsEmail()
  reEnterEmail: string;

  @IsNotEmpty()
  @IsPhoneNumber() 
  mobileNumber: string;
}

export class TermsAndConditionsDto {
//   @IsBoolean()
//   @IsNotEmpty()
  termsAccepted: boolean;
}

export class CreateApplicationDto {
  companyInformation: CompanyInformationDto;
  applicationInformation: ApplicationInformationDto;
  termsAndConditions: TermsAndConditionsDto;
}