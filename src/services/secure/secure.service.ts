import { Injectable } from '@nestjs/common';
import { createHash, pbkdf2Sync, timingSafeEqual } from 'crypto';
import getConfig from 'src/config/configuration';

@Injectable()
export class SecureService {
  createHash(text: string) {
    const config = getConfig();
    const hash = createHash('sha256');

    hash.update(text);
    hash.update(config.secret);

    return hash.digest('hex');
  }

  async hashPassword(password: string) {
    const config = getConfig();
    const hash = pbkdf2Sync(password, config.secret, 1000, 64, 'sha512');
    return hash;
  }

  async comparePassword(password, hash: Buffer): Promise<boolean> {
    const config = getConfig();
    const encryptHash = pbkdf2Sync(password, config.secret, 1000, 64, 'sha512');

    return timingSafeEqual(hash, encryptHash);
  }
}
