import { Injectable, UnauthorizedException } from '@nestjs/common';
import getL18N from 'src/l18n/l18n.lang';
import * as randomstring from 'randomstring';
import {
  PhoneSignInDto,
  SignInDto,
  SignUpDto,
  VerificationCodeDto,
} from './auth.dto';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { SecureService } from 'src/services/secure/secure.service';
import * as crypto from 'crypto';
import { AwsSnsService } from 'src/services/aws-sns/aws-sns.service';
import { RedisService } from 'src/services/redis/redis.service';
import { InjectRepository } from '@nestjs/typeorm';
import {
  EmailAlreadyExistsException,
  SmsSendingFailedException,
} from 'src/common/exception';

@Injectable()
export class AuthService {
  private publicFields: (keyof User)[] = [
    'id',
    'name',
    'last_name',
    'email',
    'photo_url',
    'rol',
  ];
  private l18n = getL18N('ES');

  constructor(
    private readonly secureService: SecureService,
    private readonly awsSnsService: AwsSnsService,
    private readonly redisService: RedisService,
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  async hash(password: string) {
    return new Promise<string>((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('hex');

      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(salt + ':' + derivedKey.toString('hex'));
      });
    });
  }

  async verify(password: string, hash: string) {
    return new Promise<boolean>((resolve, reject) => {
      const [salt, key] = hash.split(':');
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(key == derivedKey.toString('hex'));
      });
    });
  }

  async emailSignUp(payload: SignUpDto) {
    let exists = await this.usersRepository.findOne({
      where: { email: payload.email },
    });
    if (exists) {
      throw new EmailAlreadyExistsException();
    }
    const user = await this.usersRepository.save({
      ...payload,
      validation_code: '',
      password: (
        await this.secureService.hashPassword(payload.password)
      ).toString('base64'),
    });

    return this.findOne(user.id);
  }

  async findOne(id: number) {
    return this.usersRepository.findOne({
      where: { id, deleted_at: null },
      select: this.publicFields,
    });
  }

  async emailSignIn(payload: SignInDto) {
    let exists = await this.usersRepository.findOne({
      select: ['id', 'password'],
      where: { email: payload.email, deleted_at: null },
    });
    if (!exists) throw new UnauthorizedException();

    const validation = await this.secureService.comparePassword(
      payload.password,
      Buffer.from(exists.password, 'base64'),
    );
    if (!validation) throw new UnauthorizedException();

    return this.generateSessionToken(exists).then(async (token) => ({
      user: await this.findOne(exists.id),
      token,
    }));
  }

  async phoneSignIn(payload: PhoneSignInDto) {
    let exists = await this.usersRepository.findOne({
      where: { phone: payload.phone, deleted_at: null },
    });
    const validation_code = await this.generateRandomString(6);
    if (!exists) {
      await this.usersRepository.save({
        phone: payload.phone,
        validation_code,
        verified: false,
      });
      exists = await this.usersRepository.findOne({
        where: { phone: payload.phone },
      });
    } else {
      await this.usersRepository.update(
        { id: exists.id },
        {
          validation_code: validation_code,
          verified: true,
        },
      );
    }

    const message = this.l18n.sms.accountValidation(validation_code);
    await this.awsSnsService.sendSMS(payload.phone, message).catch((err) => {
      throw new SmsSendingFailedException();
    });
  }

  async verificationCode(payload: VerificationCodeDto) {
    if (!payload.email && !payload.phone) throw new UnauthorizedException();
    const query = payload.email
      ? { email: payload.email }
      : { phone: payload.phone };
    const exists = await this.usersRepository.findOne({
      where: {
        ...query,
        validation_code: payload.code,
        deleted_at: null,
      },
    });
    if (!exists) {
      throw new UnauthorizedException();
    }

    await this.usersRepository.update(
      { id: exists.id },
      {
        validation_code: '',
        verified: true,
      },
    );

    const sessionToken = await this.generateSessionToken(exists);

    return this.getSession(exists.id, sessionToken);
  }

  async getSession(id: number, sessionToken: string) {
    const session = await this.usersRepository.findOne({
      where: { id, deleted_at: null },
      select: ['id', 'name', 'last_name', 'email', 'photo_url', 'rol'],
    });
    return {
      user: session,
      token: sessionToken,
    };
  }

  async validateToken(token: string) {
    const sessionKey = `session:${token}`;
    const userId = await this.redisService.get(sessionKey);
    const session = userId
      ? await this.usersRepository.findOne({
          select: this.publicFields,
          where: {
            id: Number.parseInt(userId),
            deleted_at: null,
          },
        })
      : null;

    return session;
  }

  async generateSessionToken(user: User) {
    const token = await this.generateRandomString(64);
    await this.redisService.set(`session:${token}`, user.id.toString());
    return token;
  }

  async generateRandomString(length: number): Promise<string> {
    return randomstring.generate({
      length: length,
      readable: false,
    });
  }
}
