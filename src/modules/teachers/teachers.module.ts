import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TeacherModel } from './infrastructure/database/models/teacher.model';
import { TeacherSubjectModel } from './infrastructure/database/models/teacher_subject.model';
import { UserModel } from '../users/infrastructure/database/models/user.model';
import { SubjectModel } from '../subjects/infrastructure/database/models/subject.model';
import { TeachersController } from './presentation/controllers/teachers.controller';
import { TeachersService } from './application/services/teachers.service';

@Module({
  imports: [SequelizeModule.forFeature([TeacherModel, TeacherSubjectModel, UserModel, SubjectModel])],
  controllers: [TeachersController],
  providers: [TeachersService],
})
export class TeachersModule {}
