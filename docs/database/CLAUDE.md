# Banco de Dados — Diagrama de Relacionamentos

## Tabelas e relacionamentos

```
users (id, name, email, password, role, isActive)
  |
  ├── students (id, userId→users, name, cpf, classRoomId→classrooms, guardianId→guardians)
  ├── teachers (id, userId→users, name, cpf, registration)
  └── guardians (id, userId→users, name, cpf, phone, relationship)

classrooms (id, name, year, shift, grade, isActive)
  |
  └── students.classRoomId

subjects (id, name, workload, isActive)

grades (id, studentId→students, subjectId→subjects, classRoomId→classrooms,
        schoolYear, bimester, value, recoveryValue, finalBimesterValue)

attendance (id, studentId→students, subjectId→subjects, classRoomId→classrooms,
            teacherId, date, present, justified, justification)

school_config (id, schoolName, approvalAverage, recoveryAverage, currentYear)
```

## Relações

- **User** → **Student**: 1:1 (um usuário, um aluno)
- **User** → **Teacher**: 1:1
- **User** → **Guardian**: 1:1
- **ClassRoom** → **Student**: 1:N (uma turma tem muitos alunos)
- **Guardian** → **Student**: 1:N (um responsável por vários alunos via guardianId)
- **Student** → **Grade**: 1:N (um aluno tem muitas notas)
- **Subject** → **Grade**: 1:N
- **Student** → **Attendance**: 1:N
- **Subject** → **Attendance**: 1:N

## Sequelize auto-sync

O banco é criado automaticamente via `synchronize: true` (desenvolvimento).
Para produção, desativar e usar migrations.
