import { ApiProperty } from '@nestjs/swagger';

export class AnswerDto {
  @ApiProperty()
  bot_id: string;

  @ApiProperty()
  prompt: string;
}
