import * as Joi from 'joi';

export const updateProfileSchema = Joi.object({
  name: Joi.string(),
  last_name: Joi.string(),
  email: Joi.string().email(),
  photo: Joi.string(),
  rol: Joi.string().valid('seller', 'client'),
});
