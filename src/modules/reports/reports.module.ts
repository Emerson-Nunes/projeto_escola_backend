import { Module } from '@nestjs/common';
import { GradesModule } from '../grades/grades.module';
import { ReportsController } from './presentation/controllers/reports.controller';
import { ReportsService } from './application/services/reports.service';

@Module({
  imports: [GradesModule],
  controllers: [ReportsController],
  providers: [ReportsService],
})
export class ReportsModule {}
