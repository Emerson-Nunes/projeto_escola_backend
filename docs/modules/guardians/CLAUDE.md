# Módulo Responsáveis

## Visão Geral

Responsável (Guardian) é vinculado a um ou mais alunos. O cadastro não possui campos de endereço. O vínculo com o aluno é feito por PATCH no recurso do aluno.

---

## Modelo — Guardian

| Campo    | Tipo   | Observação               |
|----------|--------|--------------------------|
| id       | UUID   | PK                       |
| name     | STRING |                          |
| email    | STRING | único                    |
| cpf      | STRING | único, validado           |
| phone    | STRING | opcional                 |
| userId   | UUID   | FK → User                |

> Sem campos de endereço (rua, cidade, CEP, etc.).

### Associações

- `HasMany Student` (via `Student.guardianId`)

---

## API — Endpoints

### POST /guardians
Cria responsável.

Body:
```json
{
  "name": "string",
  "email": "string",
  "cpf": "string",
  "phone": "string (opcional)"
}
```

### GET /guardians / GET /guardians/:id

### PATCH /guardians/:id

### DELETE /guardians/:id

---

## Fluxo de Vínculo Responsável → Aluno

O formulário de cadastro de responsável inclui seleção do aluno a ser vinculado. O vínculo é gravado no aluno (campo `guardianId`), não no responsável.

Passos do fluxo no frontend (`GuardianFormPage`):

1. Usuário seleciona uma **turma** no seletor de turmas
2. Frontend carrega os alunos da turma via `GET /classrooms/:id/students`
3. Usuário seleciona o **aluno** no seletor de alunos
4. Ao salvar, o formulário:
   - `POST /guardians` — cria o responsável
   - `PATCH /students/:studentId` com `{ guardianId }` — vincula o aluno

---

## Frontend — GuardianFormPage

Localização: `src/pages/guardians/GuardianFormPage.tsx`

- Validação de CPF com algoritmo real via `isValidCPF()` de `src/utils/cpf.ts`
- Seletor de turma → carrega alunos paginados da turma selecionada
- Seletor de aluno filtrado pela turma escolhida
- Vínculo enviado via PATCH no endpoint de alunos após criação do responsável
