# Sistema de Gerenciamento Escolar — Ensino Médio

## Visão Geral

Sistema web completo para gerenciamento de escola de ensino médio, com frontend React e backend NestJS, persistência MySQL, autenticação JWT e arquitetura limpa.

---

## Estrutura do Projeto

```
projeto_escola/
├── frontend/          # React + Vite + TypeScript
├── backend/           # NestJS + MySQL + RabbitMQ
├── docs/              # Documentação completa
│   ├── architecture/  # Arquitetura do sistema
│   ├── api/           # Documentação da API
│   ├── database/      # Schema e entidades
│   └── modules/       # Documentação por módulo
│       ├── auth/
│       ├── students/
│       ├── teachers/
│       ├── classes/
│       ├── subjects/
│       ├── grades/
│       ├── attendance/
│       ├── reports/
│       └── dashboard/
└── CLAUDE.md          # Este arquivo
```

---

## Stack Tecnológica

### Frontend
- React 18 + Vite + TypeScript
- React Router DOM v6
- Axios + React Query (TanStack)
- TailwindCSS + Shadcn/UI
- React Hook Form + Zod
- Zustand (estado global)
- Recharts (gráficos)
- React PDF + XLSX
- Lucide React (ícones)

### Backend
- NestJS + TypeScript
- JWT Authentication (Passport)
- BCrypt (hash de senhas)
- Sequelize ORM + MySQL
- RabbitMQ (filas assíncronas)
- Class Validator + Class Transformer
- Swagger/OpenAPI

---

## Arquitetura — Clean Architecture

Cada módulo do backend segue esta estrutura:

```
backend/src/modules/MODULO/
├── domain/
│   ├── entities/       # Entidades de domínio (sem frameworks)
│   ├── repositories/   # Interfaces de repositório
│   └── interfaces/     # Contratos e interfaces
├── application/
│   ├── use-cases/      # Casos de uso da aplicação
│   ├── dto/            # Data Transfer Objects
│   └── services/       # Serviços de aplicação
├── infrastructure/
│   ├── database/
│   │   ├── models/     # Modelos Sequelize
│   │   └── repositories/ # Implementações de repositório
│   ├── queue/          # Producers/Consumers RabbitMQ
│   ├── pdf/            # Geração de PDF
│   └── spreadsheet/    # Geração de XLSX
├── presentation/
│   ├── controllers/    # Controllers HTTP
│   ├── guards/         # Guards de autenticação/autorização
│   └── decorators/     # Decorators customizados
└── module.ts
```

---

## Roles e Permissões

| Role       | Permissões                                                                 |
|------------|----------------------------------------------------------------------------|
| ADMIN      | CRUD completo de todos os recursos, configurações do sistema               |
| PROFESSOR  | Visualizar alunos/turmas, lançar notas/frequência, gerar relatórios        |
| ALUNO      | Visualizar próprio perfil, notas, frequência, boletim, turma               |
| RESPONSAVEL| Visualizar cadastro próprio, dados do aluno associado, boletim, frequência |

---

## Sistema de Notas

### Bimestres
- 1º Bimestre (nota + recuperação)
- 2º Bimestre (nota + recuperação)
- 3º Bimestre (nota + recuperação)
- 4º Bimestre (nota + recuperação)

### Médias
- **Média1** = (1º bimestre + 2º bimestre) / 2
- **Média2** = (3º bimestre + 4º bimestre) / 2
- **MédiaFinal** = (Média1 + Média2) / 2

### Status (configurável via SchoolConfig)
| Status  | Condição                                          | Cor     |
|---------|---------------------------------------------------|---------|
| APROVADO | MédiaFinal >= média_aprovacao (padrão: 7)        | Verde   |
| RECUPERAÇÃO | MédiaFinal >= media_recuperacao (padrão: 4)  | Amarelo |
| REPROVADO | MédiaFinal < media_recuperacao                  | Vermelho|

---

## Entidades Principais

- **User** — Usuário do sistema (auth)
- **Student** — Aluno
- **Teacher** — Professor
- **Guardian** — Responsável
- **ClassRoom** — Turma
- **Subject** — Disciplina
- **Enrollment** — Matrícula (aluno-turma)
- **Grade** — Nota bimestral
- **Attendance** — Frequência/chamada
- **ReportCard** — Boletim
- **SchoolConfig** — Configurações da escola

---

## Documentação Detalhada

- [Arquitetura](docs/architecture/CLAUDE.md)
- [API](docs/api/CLAUDE.md)
- [Banco de Dados](docs/database/CLAUDE.md)
- [Módulo Auth](docs/modules/auth/CLAUDE.md)
- [Módulo Alunos](docs/modules/students/CLAUDE.md)
- [Módulo Professores](docs/modules/teachers/CLAUDE.md)
- [Módulo Responsáveis](docs/modules/guardians/CLAUDE.md)
- [Módulo Turmas](docs/modules/classes/CLAUDE.md)
- [Módulo Disciplinas](docs/modules/subjects/CLAUDE.md)
- [Módulo Notas](docs/modules/grades/CLAUDE.md)
- [Módulo Frequência](docs/modules/attendance/CLAUDE.md)
- [Módulo Relatórios](docs/modules/reports/CLAUDE.md)
- [Módulo Dashboard](docs/modules/dashboard/CLAUDE.md)

---

## Execução Local

### Backend
```bash
cd backend
npm install
cp .env.example .env  # configurar variáveis
npm run migration:run
npm run seed
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env  # configurar VITE_API_URL
npm run dev
```

### Serviços necessários
- MySQL 8.x rodando na porta 3306
- RabbitMQ rodando na porta 5672

---

## Variáveis de Ambiente

### Backend (.env)
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=escola_db
DB_USER=root
DB_PASS=senha
JWT_SECRET=seu_secret_jwt
JWT_EXPIRES_IN=1d
RABBITMQ_URL=amqp://localhost:5672
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

---

## Decisões de Arquitetura — Frontend

### Toast e contexto (Toaster / useToast)

`Toaster` em `src/components/ui/Toast.tsx` aceita `children` e os envolve com `ToastContext.Provider`. Em `App.tsx`, `Toaster` envolve `AppRoutes`, garantindo que todo componente de rota possa chamar `useToast()` sem estar fora do Provider — causa raiz de telas brancas na navegação.

### AuthInitializer

Componente em `App.tsx` que chama `GET /api/auth/me` na inicialização quando existe token no storage mas o estado de usuário está vazio. Resolve o desaparecimento de itens de menu após F5 (recarregamento da página).

### ErrorBoundary por página

`PageErrorBoundary` em `src/routes/index.tsx` é um class component que envolve cada rota. Isola erros de renderização de páginas individuais sem derrubar a aplicação inteira.

### Modo escuro — variáveis CSS

`tailwind.config.js` usa o formato `hsl(var(--name))` para todas as cores semânticas (primary, secondary, destructive, etc.). `src/index.css` define as variáveis CSS para os modos claro e escuro (seletor `.dark`). Dessa forma, a troca de tema não exige rebuild — basta adicionar/remover a classe `dark` no elemento raiz.

### Select — sentinel para valor vazio

`src/components/ui/Select.tsx` usa o valor interno `__EMPTY__` para representar ausência de seleção, pois Radix UI `Select.Item` não aceita string vazia como valor. A conversão entre `__EMPTY__` e string vazia ocorre de forma transparente em `onValueChange`, sem impacto nos consumidores do componente.

### Utilitário CPF — `src/utils/cpf.ts`

| Função              | Uso                                             |
|---------------------|-------------------------------------------------|
| `isValidCPF(cpf)`   | Validação com algoritmo de dígitos verificadores|
| `formatCPFInput(v)` | Máscara progressiva durante digitação           |
| `isAdult(date)`     | Verifica se data representa >= 18 anos          |

Usado em `TeacherFormPage` e `GuardianFormPage`.

### Sidebar — restrições de role

`src/components/layout/Sidebar.tsx`:
- Turmas e Disciplinas: visíveis apenas para ADMIN e PROFESSOR
- Alunos: visível apenas para ADMIN e PROFESSOR
