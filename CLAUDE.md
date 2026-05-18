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
- Notificações: visível apenas para ADMIN e PROFESSOR

### Notificações

Módulo `NotificationsModule` em `backend/src/modules/notifications/`. ADMIN pode notificar todos os roles; PROFESSOR não pode notificar ADMIN. ALUNO e RESPONSAVEL só leem (`GET /notifications/mine`). O `Navbar` consulta `/notifications/mine` a cada 60s e mostra contador no ícone de sino.

### Matrícula automática de aluno

`StudentsService.create()` gera `enrollmentNumber` automaticamente como `{ano}{sequencial 4 dígitos}` usando contagem de matrículas do ano corrente no banco (não o relógio local). Não enviar `enrollmentNumber` no payload — campo ignorado/optional no DTO.

### Boletim inclui todas as disciplinas ativas

`GradesService.getReportCard()` sempre busca **todas as disciplinas ativas** e as inclui no resultado. Disciplinas sem notas aparecem com `mediaFinal: null` e `status: null` — alunos recém-criados já veem todas as matérias no dashboard sem necessidade de criar registros de nota.

### Segurança — defesa em profundidade

Camadas de segurança implementadas no backend (detalhes em `docs/architecture/CLAUDE.md`):

- **helmet**: headers HTTP (CSP, HSTS, X-Frame-Options, X-Content-Type-Options, etc.)
- **ThrottlerGuard global**: 120 req/min por IP; login limitado a 5 req/min (HTTP 429 após isso)
- **CORS restrito**: `CORS_ORIGIN` env var, não `*`
- **ValidationPipe**: `whitelist: true` + `forbidNonWhitelisted: true` — rejeita campos extras
- **@MaxLength()** em todos os DTOs de string + `PaginationDto.search`
- **escapeLike()** em `shared/utils/escape-like.util.ts` — escapa wildcards `%` e `_` antes de `Op.like`
- **SQL Injection**: já protegido pelo ORM (Sequelize usa prepared statements em 100% das operações)

### JWT invalida sessão ao deletar usuário

`JwtStrategy.validate()` consulta o `UserModel` a cada request. Se o usuário não existe ou `isActive = false`, lança `UnauthorizedException`. Isso garante que sessões de usuários deletados do banco expirem imediatamente sem aguardar o TTL do JWT.

### Código de disciplina com turno (M/V)

`SubjectFormPage` possui seletor de turno. A função `autoCode(name, shift)` gera o código base (3 letras de cada palavra) e adiciona sufixo: `-M` para MANHA, `-V` para TARDE. O campo `shift` é persistido no `SubjectModel`. Código é editável pelo usuário após geração automática.

### Horários de turma

`ClassRoomModel` possui campos `startTime`, `breakStartTime`, `breakEndTime`, `endTime` (strings HH:MM). Editáveis via `ClassroomFormPage` em layout de duas colunas.

### Regra obrigatória — DTOs completos com class-validator

`ValidationPipe({ forbidNonWhitelisted: true })` rejeita campos não declarados **somente** quando o `@Body()` do controller usa uma classe com decorators de `class-validator`. Tipos inline ou `any` ignoram validação.

**Obrigatório**: todo `@Body()` deve usar classe DTO. Se o frontend enviar um campo novo (ex: campo de horário), ele **deve** estar declarado no DTO com `@IsOptional()` — caso contrário retorna HTTP 400 imediatamente.

### Sincronização automática do schema (Sequelize sync alter)

`app.module.ts` configura `synchronize: true, sync: { alter: true }`. Ao iniciar, o backend adiciona automaticamente colunas novas às tabelas existentes. Colunas removidas do model **não** são apagadas do banco.

Se uma nova coluna for adicionada ao model mas a tabela já existir sem ela, **basta reiniciar o backend** — o alter rodará. Não é necessário `ALTER TABLE` manual nesse projeto (exceto durante desenvolvimento quando o backend não está rodando com a versão nova).

### Visualização por perfil — Notas e Frequência

`GradeLaunchPage` em `/grades` renderiza conteúdo diferente por role:
- ADMIN/PROFESSOR: lançamento de notas com inputs
- ALUNO: boletim próprio (somente leitura) + botão "Baixar Boletim PDF"
- RESPONSAVEL: seletor de aluno vinculado + boletim (somente leitura) + botão "Baixar Boletim PDF"

`AttendancePage` em `/attendance` renderiza diferente por role:
- ADMIN/PROFESSOR: registro de chamada
- ALUNO: frequência própria (somente leitura) + botão "Baixar Frequência PDF"
- RESPONSAVEL: seletor de aluno + frequência (somente leitura) + botão "Baixar Frequência PDF"

Menu "Relatórios" visível apenas para ADMIN e PROFESSOR.

### Loading global

`GlobalLoaderProvider` em `components/ui/GlobalLoader.tsx` expõe `useGlobalLoader()` com `showLoader(key)` / `hideLoader(key)`. Exibe overlay com spinner enquanto qualquer key estiver ativa.

### Transição de tema e páginas

Tema: `ThemeContext` aplica classe `theme-transitioning` no `html` durante a troca, ativando CSS transitions de 350ms para background-color/color/border-color.

Páginas: `PageTransition` em `components/ui/PageTransition.tsx` aplica fade + translateY ao trocar de rota.

### Menu lateral mobile

Sidebar é overlay no mobile (z-50, translate-x). O botão hamburger (ícone `Menu`) fica no `Navbar` antes do título. `AppLayout` gerencia o estado `mobileSidebarOpen` e passa callback para Navbar e Sidebar.

### Contato com a direção

Rota `/contact` (`ContactPage`) disponível para todos os roles autenticados. Exibe dados de `GET /school-config`: nome da escola, telefone, email, endereço, diretor, informações institucionais. Admin configura esses dados na aba "Informações da Direção" em `/settings`.

---

## Decisões de Arquitetura — Backend

### Validação de notas
Endpoint `POST /grades` e `POST /grades/bulk` validam `value` e `recoveryValue` com `@Min(0)` e `@Max(10)`. Backend rejeita notas fora do intervalo com HTTP 400.

### Endpoints de relatórios
Todos os endpoints de PDF/XLSX estão em `ReportsController`:
- `GET /reports/report-card/:studentId?schoolYear=N` — boletim PDF (ADMIN, PROFESSOR, ALUNO, RESPONSAVEL)
- `GET /reports/student/:studentId/attendance` — frequência PDF individual (ADMIN, PROFESSOR, ALUNO, RESPONSAVEL)
- `GET /reports/class/:classroomId?schoolYear=N` — relatório PDF de turma (ADMIN, PROFESSOR)
- `GET /reports/grades-sheet/:classroomId?schoolYear=N` — planilha XLSX de notas (ADMIN, PROFESSOR)
- `GET /reports/attendance-sheet?classRoomId=&subjectId=&startDate=&endDate=` — planilha XLSX de frequência (ADMIN, PROFESSOR)

### Anos letivos válidos
`GET /grades/valid-years` retorna array de anos com pelo menos uma nota registrada, em ordem decrescente. Usado pelo frontend para evitar mostrar anos sem dados.

### Configuração de contato
`SchoolConfigModel` possui campos adicionais: `phone`, `email`, `address`, `directorName`, `institutionalInfo`. Configuráveis via `PUT /school-config` (ADMIN only). Consumidos pela página "Contato com a Direção" (todas as roles).

### Alunos por responsável
`GET /guardians/me/students` retorna os alunos vinculados ao responsável autenticado.
`GET /students/by-guardian/:guardianId` retorna alunos com esse guardianId.
