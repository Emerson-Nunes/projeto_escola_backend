import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { Role } from '../../../../shared/enums/role.enum';
import { ClassRoomsService } from '../../application/services/classrooms.service';
import { CreateClassRoomDto } from '../../application/dto/create-classroom.dto';
import { PaginationDto } from '../../../../shared/dto/pagination.dto';

@ApiTags('ClassRooms')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('classrooms')
export class ClassRoomsController {
  constructor(private readonly service: ClassRoomsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Criar turma' })
  create(@Body() dto: CreateClassRoomDto) {
    return this.service.create(dto);
  }

  @Get('valid-years')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Anos letivos com turmas válidas' })
  getValidYears() {
    return this.service.getValidYears();
  }

  @Get()
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Listar turmas' })
  findAll(@Query() pagination: PaginationDto & { year?: string }) {
    return this.service.findAll({ ...pagination, year: pagination.year ? parseInt(pagination.year) : undefined });
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Detalhes da turma' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Get(':id/students')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Alunos da turma (com busca por nome)' })
  getStudents(@Param('id') id: string, @Query() pagination: PaginationDto) {
    return this.service.getStudents(id, pagination);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar turma' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateClassRoomDto>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Remover turma' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
