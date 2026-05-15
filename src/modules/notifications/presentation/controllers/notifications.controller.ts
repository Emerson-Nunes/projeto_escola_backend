import { Controller, Get, Post, Body, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { Role } from '../../../../shared/enums/role.enum';
import { NotificationsService } from '../../application/services/notifications.service';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly service: NotificationsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Criar notificação' })
  create(@Body() dto: { title: string; message: string; targetRoles: string[] }, @Request() req: any) {
    return this.service.create(dto, req.user);
  }

  @Get('mine')
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.ALUNO, Role.RESPONSAVEL)
  @ApiOperation({ summary: 'Notificações do usuário logado' })
  findMine(@Request() req: any) {
    return this.service.findForUser(req.user.role);
  }

  @Get()
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Todas as notificações' })
  findAll() {
    return this.service.findAll();
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Remover notificação' })
  remove(@Param('id') id: string, @Request() req: any) {
    return this.service.remove(id, req.user.id, req.user.role);
  }
}
