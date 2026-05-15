import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { getModelToken } from '@nestjs/sequelize';
import { UserModel } from '../../modules/users/infrastructure/database/models/user.model';
import { SubjectModel } from '../../modules/subjects/infrastructure/database/models/subject.model';
import { ClassRoomModel } from '../../modules/classrooms/infrastructure/database/models/classroom.model';
import { SchoolConfigModel } from '../../modules/school-config/infrastructure/database/models/school-config.model';
import { Role } from '../../shared/enums/role.enum';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel = app.get<typeof UserModel>(getModelToken(UserModel));
  const subjectModel = app.get<typeof SubjectModel>(getModelToken(SubjectModel));
  const classRoomModel = app.get<typeof ClassRoomModel>(getModelToken(ClassRoomModel));
  const configModel = app.get<typeof SchoolConfigModel>(getModelToken(SchoolConfigModel));

  // Admin
  const admin = await userModel.findOne({ where: { email: 'admin@escola.com' } });
  if (!admin) {
    await userModel.create({
      name: 'Administrador',
      email: 'admin@escola.com',
      password: 'Admin@123',
      role: Role.ADMIN,
    } as any);
    console.log('✓ Admin criado: admin@escola.com / Admin@123');
  } else {
    console.log('✓ Admin já existe');
  }

  // Disciplinas
  const subjects = [
    'Matemática', 'Português', 'Física', 'Química', 'Biologia',
    'História', 'Geografia', 'Sociologia', 'Filosofia', 'Inglês',
  ];
  for (const name of subjects) {
    const [, created] = await subjectModel.findOrCreate({
      where: { name },
      defaults: { name } as any,
    });
    if (created) console.log(`✓ Disciplina criada: ${name}`);
  }

  // Turmas
  const year = new Date().getFullYear();
  const classRooms = [
    { name: '1º A', year, shift: 'MANHA', grade: 1 },
    { name: '2º A', year, shift: 'MANHA', grade: 2 },
    { name: '3º A', year, shift: 'MANHA', grade: 3 },
  ];
  for (const room of classRooms) {
    const [, created] = await classRoomModel.findOrCreate({
      where: { name: room.name, year: room.year },
      defaults: room as any,
    });
    if (created) console.log(`✓ Turma criada: ${room.name}`);
  }

  // Config
  const [, created] = await configModel.findOrCreate({
    where: {},
    defaults: {
      schoolName: 'Sistema Escolar',
      approvalAverage: 7,
      recoveryAverage: 4,
      currentYear: year,
    } as any,
  });
  if (created) console.log('✓ Configuração criada');

  await app.close();
  console.log('\nSeed concluído!');
}

seed().catch((err) => {
  console.error('Erro no seed:', err);
  process.exit(1);
});
