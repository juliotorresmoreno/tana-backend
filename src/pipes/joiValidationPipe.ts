import {
  PipeTransform,
  Injectable,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import * as createHttpError from 'http-errors';
import { ObjectSchema } from 'joi';

type TransformValues = string | number | boolean;

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(value: TransformValues) {
    if (typeof value !== 'object') return value;

    const { error } = this.schema.validate(value);
    if (error) {
      if (
        createHttpError.isHttpError(error) ||
        error instanceof HttpException
      ) {
        throw error;
      }

      throw new BadRequestException({
        message: error.message ? `${error.message}` : `Validation failed`,
      });
    }
    return value;
  }
}
