import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SchoolConfigModel } from '../../infrastructure/database/models/school-config.model';

@Injectable()
export class SchoolConfigService {
  constructor(
    @InjectModel(SchoolConfigModel) private model: typeof SchoolConfigModel,
  ) {}

  async getConfig() {
    let config = await this.model.findOne();
    if (!config) {
      config = await this.model.create({
        schoolName: 'Sistema Escolar',
        approvalAverage: 7,
        recoveryAverage: 4,
        currentYear: new Date().getFullYear(),
      } as any);
    }
    return config;
  }

  async updateConfig(dto: any) {
    const config = await this.getConfig();
    await config.update(dto);
    return config;
  }
}
