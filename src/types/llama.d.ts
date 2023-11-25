export interface Llama {
  frequency_penalty: number;
  main_gpu: number;
  mirostat: number;
  mirostat_eta: number;
  mirostat_tau: number;
  n_keep: number;
  n_predict: number;
  penalize_nl: boolean;
  presence_penalty: number;
  prompt: string;
  repeat_last_n: number;
  repeat_penalty: number;
  seed: number;
  stop: string[];
  stream: boolean;
  temperature: number;
  tfs_z: number;
  top_k: number;
  top_p: number;
  typical_p: number;
}
