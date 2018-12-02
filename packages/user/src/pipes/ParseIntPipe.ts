import { PipeTransform, Injectable, ArgumentMetadata, HttpStatus, BadRequestException } from '@nestjs/common';

 @Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {

  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Invalid value');
    }
    return val;
  }
}