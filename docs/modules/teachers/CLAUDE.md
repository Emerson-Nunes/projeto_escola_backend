# Módulo Professores

## Modelo — TeacherModel

Campos principais:

| Campo              | Tipo     | Observação                              |
|--------------------|----------|-----------------------------------------|
| id                 | UUID     | PK                                      |
| name               | STRING   |                                         |
| email              | STRING   | único                                   |
| cpf                | STRING   | único, validado com algoritmo real       |
| registration       | STRING   | aceita também `registrationNumber`       |
| birthDate          | DATEONLY | data de nascimento, validação idade 18+  |
| phone              | STRING   | opcional                                |
| userId             | UUID     | FK → User                               |

### Associações

- `BelongsToMany Subject` via tabela `teacher_subjects` (TeacherSubjectModel)
- `findAll` e `findOne` sempre incluem a lista de disciplinas (`subjects`)

---

## API — Endpoints

### POST /teachers
Cria professor e vincula disciplinas.

Body:
```json
{
  "name": "string",
  "email": "string",
  "cpf": "string",
  "registration": "string",       // ou registrationNumber
  "birthDate": "YYYY-MM-DD",
  "phone": "string (opcional)",
  "subjectIds": ["uuid", "..."]   // opcional, vincula via junction table
}
```

### GET /teachers
Lista todos os professores, incluindo `subjects` de cada um. Ordenação padrão por nome.

### GET /teachers/:id
Retorna professor com `subjects` incluídos.

### PATCH /teachers/:id
Atualiza campos e pode redefinir vínculos de disciplinas.

Body parcial — campo `subjectIds` redefine completamente os vínculos na junction table.

### DELETE /teachers/:id

---

## Frontend — TeacherFormPage

Localização: `src/pages/teachers/TeacherFormPage.tsx`

- Validação de CPF com algoritmo real (dígitos verificadores)
- Auto-formatação do CPF no input (máscara `###.###.###-##`)
- Validação de idade mínima de 18 anos via `isAdult()` de `src/utils/cpf.ts`
- Multi-select de disciplinas: exibe badges removíveis; envia `subjectIds` no payload

---

## Utilitário CPF

Localização: `src/utils/cpf.ts`

| Função             | Descrição                                      |
|--------------------|------------------------------------------------|
| `isValidCPF(cpf)`  | Valida CPF com algoritmo de dígitos verificadores |
| `formatCPFInput(v)`| Aplica máscara progressiva durante digitação    |
| `isAdult(date)`    | Retorna true se a data representa >= 18 anos   |
