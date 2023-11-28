import {
  Controller,
  Post,
  Body,
  UsePipes,
  Res,
  Req,
  Get,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { MmluService } from './mmlu.service';
import { JoiValidationPipe } from 'src/pipes/joiValidationPipe';
import { Authentication } from 'src/utils/secure';
import { RequestWithSession } from 'src/types/http';
import { ServerResponse } from 'http';
import { AnswerDto } from '../mmlu/mmlu.dto';
import { answerSchema } from './joiSchema';
import { ApiTags } from '@nestjs/swagger';

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

  @Delete('/history/:bot_id')
  @Authentication()
  async deleteHistory(
    @Req() req: RequestWithSession,
    @Param('bot_id') botId: string,
  ) {
    return this.mmluService.deleteHistory(req.session, botId);
  }

  @Get('/history/:bot_id')
  @Authentication()
  async getHistory(
    @Req() req: RequestWithSession,
    @Param('bot_id') botId: string,
  ) {
    return this.mmluService.getHistory(req.session, botId);
  }

  @Post('/embeddings')
  @Authentication()
  async getEmbeddings(
    @Req() req: RequestWithSession,
    @Body() payload: AnswerDto,
  ) {
    return this.mmluService.getEmbeddings(payload);
  }


  @Post('/answer')
  @UsePipes(new JoiValidationPipe(answerSchema))
  @Authentication()
  async answer(
    @Req() req: RequestWithSession,
    @Res() res: ServerResponse,
    @Body() payload: AnswerDto,
  ) {
    res.setHeader('Content-Type', 'text/plain');
    await this.mmluService.answer(payload, req.session, res);
  }
}
