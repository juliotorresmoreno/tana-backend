import {
  BadRequestException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common';

export class DatabaseException extends InternalServerErrorException {
  constructor(objectOrError?: string | object | any, description?: string) {
    super(objectOrError, description);
  }
}

interface FieldError {
  message: string;
  field_name: string;
}

export class NameException extends BadRequestException {
  constructor() {
    super({
      field_name: 'name',
      message: 'Please provide a valid name.',
    } as FieldError);
  }
}

export class LastNameException extends BadRequestException {
  constructor() {
    super({
      field_name: 'last_name',
      message: 'Please provide a valid last name.',
    } as FieldError);
  }
}

export class EmailException extends BadRequestException {
  constructor() {
    super({
      field_name: 'email',
      message: 'Please provide a valid email address.',
    } as FieldError);
  }
}

export class EmailAlreadyExistsException extends BadRequestException {
  constructor() {
    super({
      field_name: 'email',
      message: 'Email already exists!',
    } as FieldError);
    this.name = 'EmailAlreadyExistsException';
  }
}

export class PasswordException extends BadRequestException {
  constructor() {
    super({
      field_name: 'password',
      message:
        'Please provide a valid password. It must be at least 8 characters long and include at least one letter, one digit, and one special character.',
    } as FieldError);
  }
}

export class SmsSendingFailedException extends InternalServerErrorException {
  constructor() {
    super('Unable to send SMS');
    this.name = 'SmsSendingFailedException';
  }
}

export class IDException extends BadRequestException {
  constructor() {
    super({
      field_name: 'id',
      message:
        'Please provide a valid id.',
    });
  }
}

export class PromptException extends BadRequestException {
  constructor() {
    super({
      field_name: 'prompt',
      message:
        'Please provide a valid prompt. It should meet specific criteria.',
    });
  }
}

export class FetchException extends ServiceUnavailableException {
  constructor() {
    super({
      message:
        'Error in communication with the server. Service not available at the moment.',
    });
  }
}
