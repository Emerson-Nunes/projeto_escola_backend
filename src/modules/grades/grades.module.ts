import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GradeModel } from './infrastructure/database/models/grade.model';
import { StudentModel } from '../students/infrastructure/database/models/student.model';
import { SubjectModel } from '../subjects/infrastructure/database/models/subject.model';
import { SchoolConfigModel } from '../school-config/infrastructure/database/models/school-config.model';
import { GradesController } from './presentation/controllers/grades.controller';
import { GradesService } from './application/services/grades.service';

@Module({
  imports: [SequelizeModule.forFeature([GradeModel, StudentModel, SubjectModel, SchoolConfigModel])],
  controllers: [GradesController],
  providers: [GradesService],
  exports: [GradesService],
})
export class GradesModule {}
