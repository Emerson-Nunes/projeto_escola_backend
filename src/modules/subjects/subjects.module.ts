import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SubjectModel } from './infrastructure/database/models/subject.model';
import { SubjectsController } from './presentation/controllers/subjects.controller';
import { SubjectsService } from './application/services/subjects.service';

@Module({
  imports: [SequelizeModule.forFeature([SubjectModel])],
  controllers: [SubjectsController],
  providers: [SubjectsService],
  exports: [SequelizeModule, SubjectsService],
})
export class SubjectsModule {}
