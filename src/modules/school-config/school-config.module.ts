import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SchoolConfigModel } from './infrastructure/database/models/school-config.model';
import { SchoolConfigController } from './presentation/controllers/school-config.controller';
import { SchoolConfigService } from './application/services/school-config.service';

@Module({
  imports: [SequelizeModule.forFeature([SchoolConfigModel])],
  controllers: [SchoolConfigController],
  providers: [SchoolConfigService],
  exports: [SchoolConfigService],
})
export class SchoolConfigModule {}
