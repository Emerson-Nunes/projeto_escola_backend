import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/sequelize';
import { JwtPayload } from '../../domain/interfaces/jwt-payload.interface';
import { UserModel } from '../../../users/infrastructure/database/models/user.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectModel(UserModel) private userModel: typeof UserModel,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET', 'escola_secret_jwt_2024'),
    });
  }

  async validate(payload: JwtPayload) {
    if (!payload.sub) throw new UnauthorizedException();
    const user = await this.userModel.findByPk(payload.sub, {
      attributes: ['id', 'name', 'email', 'role', 'isActive'],
    });
    if (!user || !user.isActive) throw new UnauthorizedException('Sessão inválida');
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}
