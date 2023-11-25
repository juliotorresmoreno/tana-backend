import { ServerResponse } from 'http';
import { Provider } from './provider';

const args = {
  frequency_penalty: 0,
  main_gpu: 0,
  mirostat: 0,
  mirostat_eta: 0.1,
  mirostat_tau: 5,
  n_keep: 0,
  n_predict: -1,
  penalize_nl: true,
  presence_penalty: 0,
  prompt:
    '[INST] <<SYS>><</SYS>>\n\nI am surprised. how can you speak?. [/INST]\n',
  repeat_last_n: 64,
  repeat_penalty: 1.1,
  seed: -1,
  stop: ['[INST]', '[/INST]', '<<SYS>>', '<</SYS>>'],
  stream: true,
  temperature: 0.8,
  tfs_z: 1,
  top_k: 40,
  top_p: 0.9,
  typical_p: 1,
};

export class Tana extends Provider {
  url = 'http://localhost:8000';

  async invoke(prompt: string, res: ServerResponse): Promise<any> {
    try {
      const response = await fetch(this.url + '/completion', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({ ...args, prompt }),
      });

      if (!response.body) {
        throw new Error('La respuesta no es un stream');
      }
      const stream = response.body;
      const reader = stream.getReader();
      let chunk;
      while ((chunk = await reader.read())) {
        if (!chunk?.toString) break;

        const data = String.fromCharCode(...chunk.value);
        const content = JSON.parse(data.substring(6)).content;

        if (content) res.write(content);
      }
    } finally {
      res.end();
    }
  }
}
