import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { Role } from '../../../../shared/enums/role.enum';
import { StudentsService } from '../../application/services/students.service';
import { CreateStudentDto } from '../../application/dto/create-student.dto';
import { PaginationDto } from '../../../../shared/dto/pagination.dto';

@ApiTags('Students')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Cadastrar aluno' })
  create(@Body() dto: CreateStudentDto) {
    return this.studentsService.create(dto);
  }

  @Get('me')
  @Roles(Role.ALUNO)
  @ApiOperation({ summary: 'Perfil do aluno logado' })
  findMe(@Request() req: any) {
    return this.studentsService.findByUserId(req.user.id);
  }

  @Get()
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiOperation({ summary: 'Listar alunos' })
  findAll(@Query() pagination: PaginationDto & { classRoomId?: string }) {
    return this.studentsService.findAll(pagination);
  }

  @Get('search')
  @Roles(Role.ADMIN, Role.PROFESSOR)
  @ApiQuery({ name: 'q', required: true, description: 'Nome parcial do aluno' })
  @ApiOperation({ summary: 'Buscar alunos por nome' })
  search(@Query('q') q: string) {
    return this.studentsService.search(q);
  }

  @Get('by-guardian/:guardianId')
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.RESPONSAVEL)
  @ApiOperation({ summary: 'Alunos do responsável' })
  findByGuardian(@Param('guardianId') guardianId: string) {
    return this.studentsService.findByGuardianId(guardianId);
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.PROFESSOR, Role.ALUNO, Role.RESPONSAVEL)
  @ApiOperation({ summary: 'Detalhes do aluno' })
  findOne(@Param('id') id: string) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar aluno' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateStudentDto>) {
    return this.studentsService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Remover aluno' })
  remove(@Param('id') id: string) {
    return this.studentsService.remove(id);
  }
}
