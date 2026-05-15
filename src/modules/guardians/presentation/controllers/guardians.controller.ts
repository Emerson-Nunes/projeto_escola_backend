import { Controller, Get, Post, Body, Patch, Param, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { Role } from '../../../../shared/enums/role.enum';
import { GuardiansService } from '../../application/services/guardians.service';
import { PaginationDto } from '../../../../shared/dto/pagination.dto';

@ApiTags('Guardians')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('guardians')
export class GuardiansController {
  constructor(private readonly service: GuardiansService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cadastrar responsável' })
  create(@Body() dto: any) {
    return this.service.create(dto);
  }

  @Get()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Listar responsáveis' })
  findAll(@Query() pagination: PaginationDto) {
    return this.service.findAll(pagination);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.RESPONSAVEL)
  @ApiOperation({ summary: 'Detalhes do responsável' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/students')
  @Roles(Role.ADMIN, Role.RESPONSAVEL)
  @ApiOperation({ summary: 'Alunos do responsável' })
  getStudents(@Param('id') id: string) {
    return this.service.getStudents(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar responsável' })
  update(@Param('id') id: string, @Body() dto: any) {
    return this.service.update(id, dto);
  }
}
