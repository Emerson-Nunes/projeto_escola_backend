import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { StudentsModule } from './modules/students/students.module';
import { TeachersModule } from './modules/teachers/teachers.module';
import { GuardiansModule } from './modules/guardians/guardians.module';
import { ClassRoomsModule } from './modules/classrooms/classrooms.module';
import { SubjectsModule } from './modules/subjects/subjects.module';
import { GradesModule } from './modules/grades/grades.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { SchoolConfigModule } from './modules/school-config/school-config.module';
import { ReportsModule } from './modules/reports/reports.module';
import { NotificationsModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([{ ttl: 60000, limit: 120 }]),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        dialect: 'mysql',
        host: config.get('DB_HOST', 'localhost'),
        port: parseInt(config.get('DB_PORT', '3306')),
        username: config.get('DB_USER', 'root'),
        password: config.get('DB_PASS', ''),
        database: config.get('DB_NAME', 'escola_db'),
        autoLoadModels: true,
        synchronize: true,
        sync: { alter: true },
        logging: false,
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    StudentsModule,
    TeachersModule,
    GuardiansModule,
    ClassRoomsModule,
    SubjectsModule,
    GradesModule,
    AttendanceModule,
    SchoolConfigModule,
    ReportsModule,
    NotificationsModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
