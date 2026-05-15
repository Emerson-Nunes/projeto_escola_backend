import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { NotificationModel } from './infrastructure/database/models/notification.model';
import { NotificationsController } from './presentation/controllers/notifications.controller';
import { NotificationsService } from './application/services/notifications.service';

@Module({
  imports: [SequelizeModule.forFeature([NotificationModel])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
