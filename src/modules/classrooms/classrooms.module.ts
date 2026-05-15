import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ClassRoomModel } from './infrastructure/database/models/classroom.model';
import { StudentModel } from '../students/infrastructure/database/models/student.model';
import { ClassRoomsController } from './presentation/controllers/classrooms.controller';
import { ClassRoomsService } from './application/services/classrooms.service';

@Module({
  imports: [SequelizeModule.forFeature([ClassRoomModel, StudentModel])],
  controllers: [ClassRoomsController],
  providers: [ClassRoomsService],
  exports: [SequelizeModule],
})
export class ClassRoomsModule {}
