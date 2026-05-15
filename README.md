# Backend — Sistema Escolar

NestJS + MySQL + Clean Architecture

## Pré-requisitos

- Node.js 18+
- MySQL 8.x rodando na porta 3306
- (Opcional) RabbitMQ na porta 5672

## Instalação

```bash
npm install
cp .env.example .env
# Editar .env com suas credenciais MySQL
```

## Criar banco de dados

```sql
CREATE DATABASE escola_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

## Executar em desenvolvimento

```bash
npm run start:dev
```

O servidor sobe em `http://localhost:3000/api`

## Seed (dados iniciais)

```bash
npm run seed
```

Cria:
- Usuário admin: `admin@escola.com` / `Admin@123`
- 10 disciplinas padrão (Matemática, Português, Física, etc.)
- 3 turmas (1º A, 2º A, 3º A)
- Configurações da escola (média aprovação: 7, recuperação: 4)

## Swagger / Documentação da API

Acesse: `http://localhost:3000/api/docs`

## Build para produção

```bash
npm run build
npm run start:prod
```

## Estrutura dos módulos

```
src/modules/
├── auth/          — JWT, login, estratégia Passport
├── users/         — CRUD de usuários
├── students/      — CRUD de alunos
├── teachers/      — CRUD de professores
├── guardians/     — CRUD de responsáveis
├── classrooms/    — CRUD de turmas
├── subjects/      — CRUD de disciplinas
├── grades/        — Notas, boletim, cálculo de médias
├── attendance/    — Frequência, chamadas
├── school-config/ — Configurações da escola
└── reports/       — Geração de PDF e XLSX
```

## Endpoints principais

| Método | Rota                                    | Descrição                   |
|--------|-----------------------------------------|-----------------------------|
| POST   | /api/auth/login                         | Login                       |
| GET    | /api/auth/me                            | Usuário logado              |
| GET    | /api/students                           | Listar alunos               |
| GET    | /api/students/search?q=nome             | Busca parcial               |
| GET    | /api/grades/student/:id/reportcard      | Boletim completo            |
| GET    | /api/classrooms/:id/students?search=mar | Alunos da turma (com busca) |
| POST   | /api/attendance/bulk                    | Registrar chamada           |
| GET    | /api/reports/student/:id/pdf            | Download PDF do boletim     |
| GET    | /api/reports/classroom/:id/grades/xlsx  | Download planilha de notas  |

## Roles e permissões

| Role        | Acesso                                            |
|-------------|---------------------------------------------------|
| ADMIN       | Acesso total                                      |
| PROFESSOR   | Visualizar, lançar notas e frequência             |
| ALUNO       | Somente visualizar próprios dados                 |
| RESPONSAVEL | Visualizar dados do aluno associado               |

## Sistema de notas

- **Bimestres**: 4 bimestres, cada um com nota + recuperação opcional
- **finalBimester** = max(nota, recuperação)
- **Media1** = (final1 + final2) / 2
- **Media2** = (final3 + final4) / 2
- **MediaFinal** = (Media1 + Media2) / 2
- **APROVADO**: MediaFinal >= 7 (configurável)
- **RECUPERACAO**: MediaFinal >= 4 (configurável)
- **REPROVADO**: MediaFinal < 4
