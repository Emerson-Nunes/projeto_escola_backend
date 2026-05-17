# Documentação da API

Base URL: `http://localhost:3000/api`
Swagger: `http://localhost:3000/api/docs`

## Autenticação

Todas as rotas (exceto `/auth/login`) requerem:
```
Authorization: Bearer <jwt_token>
```

## Auth

| Método | Rota        | Auth | Body                         | Descrição   |
|--------|-------------|------|------------------------------|-------------|
| POST   | /auth/login | Não  | `{email, password}`          | Login       |
| GET    | /auth/me    | JWT  | —                            | Perfil      |

## Users

| Método | Rota        | Roles | Descrição     |
|--------|-------------|-------|---------------|
| GET    | /users      | ADMIN | Listar        |
| POST   | /users      | ADMIN | Criar         |
| GET    | /users/:id  | ADMIN | Buscar por ID |
| PATCH  | /users/:id  | ADMIN | Atualizar     |
| DELETE | /users/:id  | ADMIN | Remover       |

## Students

| Método | Rota                   | Roles            | Descrição                          |
|--------|------------------------|------------------|------------------------------------|
| GET    | /students              | ADMIN,PROF       | Listar (paginado)                  |
| GET    | /students/me           | ALUNO            | Perfil do aluno logado             |
| GET    | /students/search?q=... | ADMIN,PROF       | Busca parcial                      |
| GET    | /students/:id          | Todos            | Detalhes                           |
| POST   | /students              | ADMIN            | Criar (enrollmentNumber auto-gerado)|
| PATCH  | /students/:id          | ADMIN            | Atualizar                          |
| DELETE | /students/:id          | ADMIN            | Remover                            |

Nota: `enrollmentNumber` é gerado automaticamente como `{ano}{sequencial 4 dígitos}` (ex: `20240001`). Não enviar no payload.

## Teachers

| Método | Rota          | Roles      | Descrição                    |
|--------|---------------|------------|------------------------------|
| GET    | /teachers     | ADMIN,PROF | Listar                       |
| GET    | /teachers/me  | PROFESSOR  | Perfil do professor logado   |
| GET    | /teachers/:id | ADMIN,PROF | Detalhes                     |
| POST   | /teachers     | ADMIN      | Criar                        |
| PATCH  | /teachers/:id | ADMIN      | Atualizar                    |
| DELETE | /teachers/:id | ADMIN      | Remover                      |

## Guardians

| Método | Rota            | Roles       | Descrição                                       |
|--------|-----------------|-------------|-------------------------------------------------|
| GET    | /guardians      | ADMIN       | Listar                                          |
| GET    | /guardians/me   | RESPONSAVEL | Perfil do responsável logado (inclui `students`)|
| GET    | /guardians/:id  | ADMIN       | Detalhes                                        |
| POST   | /guardians      | ADMIN       | Criar                                           |
| PATCH  | /guardians/:id  | ADMIN       | Atualizar                                       |
| DELETE | /guardians/:id  | ADMIN       | Remover                                         |

## Notifications

| Método | Rota                 | Roles            | Descrição                           |
|--------|----------------------|------------------|-------------------------------------|
| POST   | /notifications       | ADMIN,PROFESSOR  | Criar notificação                   |
| GET    | /notifications/mine  | Todos            | Notificações para o role do usuário |
| GET    | /notifications       | ADMIN,PROFESSOR  | Listar todas                        |
| DELETE | /notifications/:id   | ADMIN,PROFESSOR  | Remover (própria ou ADMIN)          |

Regras de targetRoles: ADMIN pode notificar qualquer role; PROFESSOR não pode notificar ADMIN.

## ClassRooms

| Método | Rota                        | Roles      | Descrição          |
|--------|-----------------------------|------------|--------------------|
| GET    | /classrooms                 | ADMIN,PROF | Listar             |
| POST   | /classrooms                 | ADMIN      | Criar              |
| GET    | /classrooms/:id             | ADMIN,PROF | Detalhes           |
| GET    | /classrooms/:id/students    | ADMIN,PROF | Alunos (c/ busca)  |
| PATCH  | /classrooms/:id             | ADMIN      | Atualizar          |
| DELETE | /classrooms/:id             | ADMIN      | Remover            |

## Grades

| Método | Rota                              | Roles              | Descrição    |
|--------|-----------------------------------|--------------------|--------------|
| POST   | /grades                           | ADMIN,PROF         | Lançar nota  |
| GET    | /grades/student/:id               | Todos              | Notas        |
| GET    | /grades/student/:id/reportcard    | Todos              | Boletim      |
| GET    | /grades/classroom/:id             | ADMIN,PROF         | Notas turma  |

## Attendance

| Método | Rota                        | Roles      | Descrição         |
|--------|-----------------------------|------------|-------------------|
| POST   | /attendance/bulk            | ADMIN,PROF | Chamada em lote   |
| GET    | /attendance/student/:id     | Todos      | Frequência aluno  |
| GET    | /attendance/classroom/:id   | ADMIN,PROF | Frequência turma  |
| PATCH  | /attendance/:id/justify     | ADMIN,PROF | Justificar falta  |

## Reports

| Método | Rota                               | Roles | Descrição         |
|--------|------------------------------------|-------|-------------------|
| GET    | /reports/student/:id/pdf           | JWT   | PDF do boletim    |
| GET    | /reports/classroom/:id/grades/xlsx | JWT   | Planilha de notas |

## Paginação

Todos os endpoints de listagem aceitam:
```
?page=1&limit=10&search=termo
```

Resposta:
```json
{ "data": [...], "total": 100, "page": 1, "limit": 10, "totalPages": 10 }
```
