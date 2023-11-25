import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Res,
  UsePipes,
  Req,
} from '@nestjs/common';
import { MmluService } from './mmlu.service';
import { ApiTags } from '@nestjs/swagger';
import { AnswerDto } from './mmlu.dto';
import { JoiValidationPipe } from 'src/pipes/joiValidationPipe';
import { answerSchema } from './joiSchema';
import { ServerResponse } from 'http';
import { Authentication } from 'src/utils/secure';
import { RequestWithSession } from 'src/types/http';

@ApiTags('mmlu')
@Controller('mmlu')
export class MmluController {
  constructor(private readonly mmluService: MmluService) {}

  @Get()
  findAll() {
    return this.mmluService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mmluService.findOne(+id);
  }

  @Post('/answer')
  @Authentication()
  @UsePipes(new JoiValidationPipe(answerSchema))
  async answer(
    @Req() req: RequestWithSession,
    @Res() res: ServerResponse,
    @Body() payload: AnswerDto,
  ) {
    await this.mmluService.answer(payload, req.session, res);
  }
}
