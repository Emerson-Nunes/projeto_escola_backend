import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GradesModule } from '../grades/grades.module';
import { AttendanceModule } from '../attendance/attendance.module';
import { StudentModel } from '../students/infrastructure/database/models/student.model';
import { ClassRoomModel } from '../classrooms/infrastructure/database/models/classroom.model';
import { ReportsController } from './presentation/controllers/reports.controller';
import { ReportsService } from './application/services/reports.service';

@Module({
  imports: [
    GradesModule,
    AttendanceModule,
    SequelizeModule.forFeature([StudentModel, ClassRoomModel]),
  ],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
