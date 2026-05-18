import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../../shared/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../shared/guards/roles.guard';
import { Roles } from '../../../../shared/decorators/roles.decorator';
import { Role } from '../../../../shared/enums/role.enum';
import { SubjectsService } from '../../application/services/subjects.service';
import { CreateSubjectDto } from '../../application/dto/create-subject.dto';
import { PaginationDto } from '../../../../shared/dto/pagination.dto';

@ApiTags('Subjects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly service: SubjectsService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Criar disciplina' })
  create(@Body() dto: CreateSubjectDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar disciplinas' })
  findAll(@Query() pagination: PaginationDto) {
    return this.service.findAll(pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar disciplina' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Atualizar disciplina' })
  update(@Param('id') id: string, @Body() dto: Partial<CreateSubjectDto>) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  @ApiOperation({ summary: 'Remover disciplina' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
