import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ClassRoomModel } from '../../infrastructure/database/models/classroom.model';
import { StudentModel } from '../../../students/infrastructure/database/models/student.model';
import { CreateClassRoomDto } from '../dto/create-classroom.dto';
import { PaginationDto } from '../../../../shared/dto/pagination.dto';
import { escapeLike } from '../../../../shared/utils/escape-like.util';

@Injectable()
export class ClassRoomsService {
  constructor(
    @InjectModel(ClassRoomModel) private classRoomModel: typeof ClassRoomModel,
    @InjectModel(StudentModel) private studentModel: typeof StudentModel,
  ) {}

  create(dto: CreateClassRoomDto) {
    return this.classRoomModel.create(dto as any);
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10, search } = pagination;
    const offset = (page - 1) * limit;
    const where: any = {};
    if (search) where.name = { [Op.like]: `%${escapeLike(search)}%` };

    const { rows, count } = await this.classRoomModel.findAndCountAll({ where, limit, offset, order: [["name", "ASC"]] });
    return { data: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) };
  }

  async findOne(id: string) {
    const room = await this.classRoomModel.findByPk(id);
    if (!room) throw new NotFoundException('Turma não encontrada');
    return room;
  }

  async getStudents(id: string, pagination: PaginationDto) {
    await this.findOne(id);
    const { page = 1, limit = 10, search } = pagination;
    const offset = (page - 1) * limit;
    const where: any = { classRoomId: id };
    if (search) where.name = { [Op.like]: `%${escapeLike(search)}%` };

    const { rows, count } = await this.studentModel.findAndCountAll({ where, limit, offset, order: [["name", "ASC"]] });
    return { data: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) };
  }

  async update(id: string, dto: Partial<CreateClassRoomDto>) {
    const room = await this.findOne(id);
    await room.update(dto);
    return room;
  }

  async remove(id: string) {
    const room = await this.findOne(id);
    await room.destroy();
    return { message: 'Turma removida' };
  }
}
