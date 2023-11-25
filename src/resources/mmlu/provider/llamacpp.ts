import { LlamaCpp } from 'langchain/llms/llama_cpp';
import { Provider } from './provider';
import { ServerResponse } from 'http';

export class llama2Cpp extends Provider {
  llm: LlamaCpp;

  constructor() {
    super();
    this.llm = new LlamaCpp({
      modelPath: 'models/llama2-7b-ollama.gguf',
      batchSize: 512,
      gpuLayers: 50,
      contextSize: 4096,
      embedding: true,
    });
  }

  async invoke(prompt: string, res: ServerResponse) {
    const response = await this.llm.predict(prompt);
    res.end(response);
  }
}
