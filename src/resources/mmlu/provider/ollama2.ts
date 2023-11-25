import { Ollama } from 'langchain/llms/ollama';
import { Provider } from './provider';
import { ServerResponse } from 'http';

export class Ollama2 extends Provider {
  llm = new Ollama({
    baseUrl: 'http://localhost:11434',
    model: 'llama2',
  });

  async invoke(prompt: string, res: ServerResponse) {
    const stream = await this.llm.stream(prompt);

    for await (const chunk of stream) {
      res.write(chunk);
    }
    res.end();
  }
}
