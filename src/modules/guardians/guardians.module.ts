import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GuardianModel } from './infrastructure/database/models/guardian.model';
import { UserModel } from '../users/infrastructure/database/models/user.model';
import { StudentModel } from '../students/infrastructure/database/models/student.model';
import { GuardiansController } from './presentation/controllers/guardians.controller';
import { GuardiansService } from './application/services/guardians.service';

@Module({
  imports: [SequelizeModule.forFeature([GuardianModel, UserModel, StudentModel])],
  controllers: [GuardiansController],
  providers: [GuardiansService],
})
export class GuardiansModule {}
