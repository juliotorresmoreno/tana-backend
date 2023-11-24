import * as Joi from 'joi';
import {
  EmailException,
  LastNameException,
  NameException,
  PasswordException,
} from 'src/common/exception';
import { phoneValidation } from 'src/utils/joiValidations';

export const phoneSignInSchema = Joi.object({
  phone: Joi.string().required().custom(phoneValidation),
});

export const signInSchema = Joi.object({
  email: Joi.string().required().error(new EmailException()),
  password: Joi.string().required().error(new PasswordException()),
});

export const signUpSchema = Joi.object({
  name: Joi.string().required().error(new NameException()),
  last_name: Joi.string().required().error(new LastNameException()),
  phone: Joi.string()
    .custom(phoneValidation)
    .error(new Error('¡El phone no es valido!.')),
  email: Joi.string().email().required().error(new EmailException()),
  password: Joi.string()
    .required()
    .pattern(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\-@$!%*#?&])[A-Za-z\d\-@$!%*#?&]{8,}$/,
    )
    .error(new PasswordException()),
});

export const verificationCodechema = Joi.object({
  phone: Joi.string()
    .pattern(
      /^[\(]?[\+]?(\d{2}|\d{3})[\)]?[\s]?((\d{6}|\d{8})|(\d{3}[\*\.\-\s]){3}|(\d{2}[\*\.\-\s]){4}|(\d{4}[\*\.\-\s]){2})|\d{8}|\d{10}|\d{12}$/,
    )
    .error(new Error('¡El phone no es valido!.')),
  email: Joi.string().email().error(new Error('¡El email no es valido!.')),
  code: Joi.string()
    .required()
    .min(6)
    .max(6)
    .error(new Error('¡El code no es valido!.')),
});
