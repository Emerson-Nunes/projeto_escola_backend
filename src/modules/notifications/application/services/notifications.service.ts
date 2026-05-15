import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { NotificationModel } from '../../infrastructure/database/models/notification.model';
import { Role } from '../../../../shared/enums/role.enum';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(NotificationModel) private notifModel: typeof NotificationModel,
  ) {}

  async create(dto: { title: string; message: string; targetRoles: string[] }, user: { id: string; name?: string; role: string }) {
    const allowedTargets = this.getAllowedTargets(user.role as Role);
    const denied = dto.targetRoles.filter((r) => !allowedTargets.includes(r as Role));
    if (denied.length) throw new ForbiddenException(`Papel ${denied.join(',')} não permitido para este usuário`);

    return this.notifModel.create({
      title: dto.title,
      message: dto.message,
      senderUserId: user.id,
      senderName: user.name || 'Sistema',
      targetRoles: dto.targetRoles.join(','),
    } as any);
  }

  async findForUser(userRole: string) {
    const all = await this.notifModel.findAll({
      where: { isActive: true },
      order: [['createdAt', 'DESC']],
    });
    return all.filter((n) => {
      const roles = (n.targetRoles || '').split(',').map((r) => r.trim());
      return roles.includes(userRole);
    });
  }

  async findAll() {
    return this.notifModel.findAll({ order: [['createdAt', 'DESC']] });
  }

  async remove(id: string, userId: string, userRole: string) {
    const n = await this.notifModel.findByPk(id);
    if (!n) throw new NotFoundException();
    if (userRole !== Role.ADMIN && n.senderUserId !== userId) throw new ForbiddenException();
    await n.destroy();
    return { message: 'Notificação removida' };
  }

  private getAllowedTargets(role: Role): Role[] {
    if (role === Role.ADMIN) return [Role.ADMIN, Role.PROFESSOR, Role.ALUNO, Role.RESPONSAVEL];
    if (role === Role.PROFESSOR) return [Role.PROFESSOR, Role.ALUNO, Role.RESPONSAVEL];
    return [];
  }
}
