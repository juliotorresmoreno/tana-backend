import { Injectable } from '@nestjs/common';
import { SESv2 } from '@aws-sdk/client-sesv2';
import getConfig from 'src/config/configuration';
import { Configuration } from 'src/types/configuration';

@Injectable()
export class AwsSesService {
  private config: Configuration;
  private SESv2?: SESv2;

  constructor() {
    this.config = getConfig();
    const awsConfig = this.config.aws;
    if (awsConfig && awsConfig.credentials) {
      this.SESv2 = new SESv2({
        credentials: this.config.aws.credentials,
        region: (awsConfig.sns || {}).region || awsConfig.region,
      });
    }
  }

  async sendEMAIL(to: string, subject: string, message: string) {
    if (!this.SESv2) {
      throw new Error('No se puede enviar el Email');
    }
    const result = await this.SESv2.sendEmail({
      Destination: { ToAddresses: [to] },
      Content: {
        Simple: {
          Body: {
            Html: {
              Data: message,
              Charset: 'utf-8',
            },
          },
          Subject: {
            Data: subject,
            Charset: 'utf-8',
          },
        },
      },
    });

    if (this.config.env === 'development') {
      console.log('Enviado', to, subject, message, result);
    }
  }
}
