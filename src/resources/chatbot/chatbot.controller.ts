import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ChatBotService } from './chatbot.service';

@ApiTags('tana-ai')
@Controller('tana-ai')
export class ChatBotController {
  constructor(private readonly authService: ChatBotService) {}
}
