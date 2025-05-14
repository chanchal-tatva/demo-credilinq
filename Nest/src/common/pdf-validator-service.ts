import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as pdfParse from 'pdf-parse';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

@Injectable()
export class PdfValidatorService {
  async validateBankStatement(
    filePath: string,
    startDate: string,
    endDate: string
  ): Promise<{ isValid: boolean; invalidDates?: string[] }> {
    try {
      // Validate input date parameters
      console.log("Start Date: ", startDate)
      console.log("End Date: ", endDate)
      const start = dayjs(startDate, 'DD-MM-YYYY', true);
      const end = dayjs(endDate, 'DD-MM-YYYY', true);
      console.log("Start: ", start)
      console.log("End: ", end)
      if (!start.isValid() || !end.isValid()) {
        throw new Error(`Invalid date range parameters. Start: ${startDate}, End: ${endDate}`);
      }
console.log("File Path: ", filePath)
      // Read and parse PDF
      const dataBuffer = fs.readFileSync(filePath);
      console.log("dataBuffer ", dataBuffer)
      const pdfData = await pdfParse(dataBuffer);
      console.log("pdfData ", pdfData)
      const text = pdfData.text;

      console.log("PDF Text: ", text)

      // Find all dates in the document
      const dateRegex = /(\d{2}[-\/]\d{2}[-\/]\d{4})/g;
      const dateMatches = text.matchAll(dateRegex);
      const dates = Array.from(dateMatches, match => match[1].replace(/\//g, '-'));

      console.log("Dates: ", dates)

      // If no dates found, consider invalid
      if (dates.length === 0) {
        return {
          isValid: false,
          invalidDates: ['No dates found in document']
        };
      }

      // Validate each date
      const invalidDates: string[] = [];
      
      for (const dateStr of dates) {
        const date = dayjs(dateStr, 'DD-MM-YYYY', true);
        
        if (!date.isValid()) {
          invalidDates.push(`Invalid date format: ${dateStr}`);
          continue;
        }

        if (date.isBefore(start) || date.isAfter(end)) {
          invalidDates.push(`Date out of range: ${dateStr}`);
        }
      }
      console.log("Invalid Dates: ", invalidDates)

      // Only valid if ALL dates are within range
      return {
        isValid: invalidDates.length === 0,
        invalidDates: invalidDates.length > 0 ? invalidDates : undefined
      };
    } catch (error) {
      return {
        isValid: false,
        invalidDates: [`Validation error: ${error.message}`]
      };
    }
  }
}