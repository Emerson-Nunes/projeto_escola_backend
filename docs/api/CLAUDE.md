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

| Método | Rota                   | Roles            | Descrição           |
|--------|------------------------|------------------|---------------------|
| GET    | /students              | ADMIN,PROF       | Listar (paginado)   |
| GET    | /students/search?q=... | ADMIN,PROF       | Busca parcial       |
| GET    | /students/:id          | Todos            | Detalhes            |
| POST   | /students              | ADMIN            | Criar               |
| PATCH  | /students/:id          | ADMIN            | Atualizar           |
| DELETE | /students/:id          | ADMIN            | Remover             |

## Teachers

| Método | Rota          | Roles      | Descrição |
|--------|---------------|------------|-----------|
| GET    | /teachers     | ADMIN,PROF | Listar    |
| GET    | /teachers/:id | ADMIN,PROF | Detalhes  |
| POST   | /teachers     | ADMIN      | Criar     |
| PATCH  | /teachers/:id | ADMIN      | Atualizar |
| DELETE | /teachers/:id | ADMIN      | Remover   |

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
