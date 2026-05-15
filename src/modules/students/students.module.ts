import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StudentModel } from './infrastructure/database/models/student.model';
import { UserModel } from '../users/infrastructure/database/models/user.model';
import { StudentsController } from './presentation/controllers/students.controller';
import { StudentsService } from './application/services/students.service';

@Module({
  imports: [SequelizeModule.forFeature([StudentModel, UserModel])],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [SequelizeModule],
})
export class StudentsModule {}
