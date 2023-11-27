import { Credentials } from 'aws-sdk';
import { CredentialsOptions } from 'aws-sdk/lib/credentials';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface RedisConfiguration {
  url: string;
}

export interface AWSConfiguration {
  region: string;
  credentials?: CredentialsOptions;
  cognito?: {
    aws_user_pools_id: string;
    aws_cognito_region: string;
    aws_user_pools_web_client_id: string;
  };
  s3?: {
    signature_version: string;
    region?: string;
  };
  sns?: {
    region?: string;
  };
  ses: {
    default_from: string;
    region?: string;
  };
}

export interface EmbeddingsConfiguration {
  path: string;
  model: string;
}

export interface OllamaConfiguration {
  url: string;
}

export interface ChromaDBConfiguration {
  url: string;
}

export interface DatabaseConfiguration extends TypeOrmModuleOptions {}

export interface TanaAIConfiguration {
  url: string;
}

export interface Configuration {
  env: 'development' | 'production';
  port: number;
  secret: string;
  database: DatabaseConfiguration;
  redis: RedisConfiguration;
  ollama: Ollama;
  baseUrl: string;
  pageSize: number;
  aws?: AWSConfiguration;
  basePath: string;
  embeddings: EmbeddingsConfiguration;
  chromadb: ChromaDBConfiguration;
  tanaai: TanaAIConfiguration;
}
