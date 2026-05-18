import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { StudentModel } from '../../infrastructure/database/models/student.model';
import { UserModel } from '../../../users/infrastructure/database/models/user.model';
import { ClassRoomModel } from '../../../classrooms/infrastructure/database/models/classroom.model';
import { CreateStudentDto } from '../dto/create-student.dto';
import { PaginationDto } from '../../../../shared/dto/pagination.dto';
import { Role } from '../../../../shared/enums/role.enum';
import { escapeLike } from '../../../../shared/utils/escape-like.util';

@Injectable()
export class StudentsService {
  constructor(
    @InjectModel(StudentModel) private studentModel: typeof StudentModel,
    @InjectModel(UserModel) private userModel: typeof UserModel,
  ) {}

  async create(dto: CreateStudentDto) {
    const year = new Date().getFullYear();
    const yearCount = await this.studentModel.count({
      where: { enrollmentNumber: { [Op.like]: `${year}%` } },
    });
    const enrollmentNumber = `${year}${String(yearCount + 1).padStart(4, '0')}`;

    const user = await this.userModel.create({
      name: dto.name,
      email: dto.email,
      password: dto.password || 'Aluno@123',
      role: Role.ALUNO,
    } as any);

    return this.studentModel.create({
      userId: (user as any).id,
      name: dto.name,
      cpf: (dto.cpf || '').replace(/\D/g, ''),
      birthDate: dto.birthDate,
      phone: dto.phone,
      address: dto.address || '',
      enrollmentNumber,
      classRoomId: dto.classRoomId,
      guardianId: dto.guardianId,
    } as any);
  }

  async findByUserId(userId: string) {
    const student = await this.studentModel.findOne({
      where: { userId },
      include: [{ model: ClassRoomModel }],
    });
    if (!student) throw new NotFoundException('Aluno não encontrado');
    return student;
  }

  async findAll(pagination: PaginationDto & { classRoomId?: string }) {
    const { page = 1, limit = 10, search, classRoomId } = pagination;
    const offset = (page - 1) * limit;
    const where: any = {};
    if (search) where.name = { [Op.like]: `%${escapeLike(search)}%` };
    if (classRoomId) where.classRoomId = classRoomId;

    const { rows, count } = await this.studentModel.findAndCountAll({
      where,
      limit,
      offset,
      include: [{ model: ClassRoomModel, attributes: ['id', 'name'] }],
    });
    return { data: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) };
  }

  async findOne(id: string) {
    const student = await this.studentModel.findByPk(id, {
      include: [{ model: ClassRoomModel }],
    });
    if (!student) throw new NotFoundException('Aluno não encontrado');
    return student;
  }

  async update(id: string, dto: Partial<CreateStudentDto>) {
    const student = await this.studentModel.findByPk(id);
    if (!student) throw new NotFoundException('Aluno não encontrado');
    await student.update(dto);
    return student;
  }

  async remove(id: string) {
    const student = await this.findOne(id);
    await student.destroy();
    return { message: 'Aluno removido' };
  }

  async search(q: string) {
    return this.studentModel.findAll({
      where: { name: { [Op.like]: `%${escapeLike(q)}%` } },
      include: [{ model: ClassRoomModel, attributes: ['id', 'name'] }],
      limit: 20,
    });
  }

  async findByGuardianId(guardianId: string) {
    return this.studentModel.findAll({
      where: { guardianId },
      include: [{ model: ClassRoomModel, attributes: ['id', 'name'] }],
    });
  }
}
