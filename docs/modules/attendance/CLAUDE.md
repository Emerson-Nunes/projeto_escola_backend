# Módulo Frequência

## Visão Geral

Registro de presença/ausência por aula, vinculado a turma, disciplina e aluno.

---

## Entidade — Attendance

| Campo       | Tipo    | Observação                         |
|-------------|---------|-------------------------------------|
| id          | UUID    | PK                                  |
| studentId   | UUID    | FK → Student                        |
| classRoomId | UUID    | FK → ClassRoom                      |
| subjectId   | UUID    | FK → Subject                        |
| date        | DATE    | data da aula                        |
| present     | BOOLEAN | true = presente                     |

---

## API — Endpoints Relevantes

### GET /classrooms/:id/students

Retorna resposta paginada com os alunos da turma.

Resposta:
```json
{
  "data": [Student],
  "total": 30,
  "page": 1,
  "limit": 50,
  "totalPages": 1
}
```

> Atenção: o campo `data` contém o array. Consumir como `students?.data` no frontend, não diretamente como array.

### POST /attendance
Registra presença de um ou mais alunos em uma aula.

### GET /attendance?classRoomId=&subjectId=&date=
Lista registros de frequência com filtros.

---

## Frontend — AttendancePage

Localização: `src/pages/attendance/AttendancePage.tsx`

- Carrega alunos via `classrooms.service.ts → findStudents()` que retorna `PaginatedResponse<Student>`
- Acessa a lista como `students?.data` (não `students` diretamente)
- `src/services/classrooms.service.ts`: `findStudents` tem tipo de retorno `PaginatedResponse<Student>`

---

## Serviço Frontend

`classrooms.service.ts — findStudents(classRoomId)`

Retorno: `Promise<PaginatedResponse<Student>>`

```ts
// PaginatedResponse
{
  data: Student[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```
