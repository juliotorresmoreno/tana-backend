import { Injectable } from '@nestjs/common';
import getConfig from 'src/config/configuration';
import { Configuration } from 'src/types/configuration';
import { PublishCommand, SNSClient } from '@aws-sdk/client-sns';

@Injectable()
export class AwsSnsService {
  private config: Configuration;
  private clientSNS?: SNSClient;

  constructor() {
    this.config = getConfig();
    const awsConfig = this.config.aws;
    if (awsConfig && awsConfig.credentials) {
      this.clientSNS = new SNSClient({
        credentials: this.config.aws.credentials,
        region: (awsConfig.sns || {}).region || awsConfig.region,
      });
    }
  }

  async sendSMS(phone: string, message: string) {
    const nodeEnv = this.config.env;
    if (!this.clientSNS) {
      throw new Error('No se puede enviar el SMS');
    }

    const response = await this.clientSNS.send(
      new PublishCommand({
        Message: message,
        PhoneNumber: phone,
      }),
    );
    if (nodeEnv === 'development') {
      console.log('Enviado', phone, message, response);
    }
  }
}
