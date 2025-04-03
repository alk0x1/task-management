import { Injectable, Logger } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secretjwtkeychangeinproduction',
    });
    this.logger.log('JwtStrategy initialized with secret key configuration');
  }

  async validate(payload: any) {
    this.logger.log(`JWT Validation - Payload received: ${JSON.stringify(payload)}`);
    return { userId: payload.sub, email: payload.email, role: payload.role };
  }
}