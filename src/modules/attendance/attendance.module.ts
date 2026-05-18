import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AttendanceModel } from './infrastructure/database/models/attendance.model';
import { StudentModel } from '../students/infrastructure/database/models/student.model';
import { SubjectModel } from '../subjects/infrastructure/database/models/subject.model';
import { AttendanceController } from './presentation/controllers/attendance.controller';
import { AttendanceService } from './application/services/attendance.service';

@Module({
  imports: [SequelizeModule.forFeature([AttendanceModel, StudentModel, SubjectModel])],
  controllers: [AttendanceController],
  providers: [AttendanceService],
  exports: [AttendanceService],
})
export class AttendanceModule {}
