import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { Role } from '../../../../shared/enums/role.enum';
import { SchoolConfigService } from '../../application/services/school-config.service';

@ApiTags('SchoolConfig')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('school-config')
export class SchoolConfigController {
  constructor(private readonly service: SchoolConfigService) {}

  @Get()
  @ApiOperation({ summary: 'Obter configurações da escola' })
  getConfig() {
    return this.service.getConfig();
  }

  @Patch()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar configurações da escola' })
  updateConfig(@Body() dto: any) {
    return this.service.updateConfig(dto);
  }
}
