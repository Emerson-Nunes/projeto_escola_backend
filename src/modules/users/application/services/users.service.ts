import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { UserModel } from '../../infrastructure/database/models/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PaginationDto } from '../../../../shared/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(UserModel) private userModel: typeof UserModel) {}

  async create(dto: CreateUserDto) {
    return this.userModel.create(dto as any);
  }

  async findAll(pagination: PaginationDto) {
    const { page = 1, limit = 10, search } = pagination;
    const offset = (page - 1) * limit;
    const where: any = {};
    if (search) where.name = { [Op.like]: `%${search}%` };

    const { rows, count } = await this.userModel.findAndCountAll({
      where,
      limit,
      offset,
      attributes: { exclude: ['password'] },
    });
    return { data: rows, total: count, page, limit, totalPages: Math.ceil(count / limit) };
  }

  async findOne(id: string) {
    const user = await this.userModel.findByPk(id, {
      attributes: { exclude: ['password'] },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const user = await this.userModel.findByPk(id);
    if (!user) throw new NotFoundException('Usuário não encontrado');
    await user.update(dto);
    return user;
  }

  async remove(id: string) {
    const user = await this.findOne(id);
    await (user as any).destroy();
    return { message: 'Usuário removido com sucesso' };
  }
}
