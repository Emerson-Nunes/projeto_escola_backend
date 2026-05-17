# Módulo Grades (Notas)

## Fórmulas de cálculo

```
finalBimesterValue = max(value, recoveryValue ?? value)

media1 = (finalBimester1 + finalBimester2) / 2
media2 = (finalBimester3 + finalBimester4) / 2
mediaFinal = (media1 + media2) / 2
```

## Status do aluno (configurável via SchoolConfig)

| Status      | Condição                              | Cor     |
|-------------|---------------------------------------|---------|
| APROVADO    | mediaFinal >= approvalAverage (7)     | Verde   |
| RECUPERACAO | mediaFinal >= recoveryAverage (4)     | Amarelo |
| REPROVADO   | mediaFinal < recoveryAverage          | Vermelho|

## Endpoints

| Método | Rota                              | Roles                    | Descrição            |
|--------|-----------------------------------|--------------------------|----------------------|
| POST   | /grades                           | ADMIN, PROFESSOR         | Lançar/atualizar nota|
| GET    | /grades/student/:id               | Todos autenticados       | Notas do aluno       |
| GET    | /grades/student/:id/reportcard    | Todos autenticados       | Boletim completo     |
| GET    | /grades/classroom/:id             | ADMIN, PROFESSOR         | Notas da turma       |

## Payload para lançar nota (POST /grades)

```json
{
  "studentId": "uuid",
  "subjectId": "uuid",
  "classRoomId": "uuid",
  "schoolYear": 2024,
  "bimester": 1,
  "value": 8.5,
  "recoveryValue": null
}
```

## Resposta do boletim (GET /grades/student/:id/reportcard)

O boletim sempre retorna **todas as disciplinas ativas** do sistema, mesmo sem notas lançadas.
Disciplinas sem notas têm `bimesters: []`, `media1/media2/mediaFinal: null` e `status: null`.

```json
{
  "student": { "id": "...", "name": "João Silva" },
  "subjects": [
    {
      "subject": { "id": "...", "name": "Matemática", "code": "MAT-M" },
      "bimesters": [
        { "bimester": 1, "value": 7.0, "recoveryValue": null, "finalValue": 7.0 },
        { "bimester": 2, "value": 5.5, "recoveryValue": 7.0, "finalValue": 7.0 },
        { "bimester": 3, "value": 8.0, "recoveryValue": null, "finalValue": 8.0 },
        { "bimester": 4, "value": 9.0, "recoveryValue": null, "finalValue": 9.0 }
      ],
      "media1": 7.0,
      "media2": 8.5,
      "mediaFinal": 7.75,
      "status": "APROVADO"
    },
    {
      "subject": { "id": "...", "name": "Física", "code": "FIS-M" },
      "bimesters": [],
      "media1": null,
      "media2": null,
      "mediaFinal": null,
      "status": null
    }
  ],
  "approvalAverage": 7,
  "recoveryAverage": 4
}
```
