import * as Joi from 'joi';
import { IDException, PromptException } from 'src/common/exception';

export const answerSchema = Joi.object({
  id: Joi.number().required().error(new IDException()),
  prompt: Joi.string().required().error(new PromptException()),
});
