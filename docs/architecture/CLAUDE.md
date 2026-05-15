# Arquitetura — Clean Architecture

## Estrutura por módulo

```
src/modules/MODULO/
├── domain/
│   ├── entities/         — Entidades de negócio (sem dependência de framework)
│   ├── repositories/     — Interfaces de repositório (contratos)
│   └── interfaces/       — Contratos e tipos do domínio
│
├── application/
│   ├── use-cases/        — Lógica de negócio orquestrada
│   ├── dto/              — Data Transfer Objects (validações)
│   └── services/         — Serviços de aplicação
│
├── infrastructure/
│   ├── database/
│   │   ├── models/       — Modelos Sequelize (ORM)
│   │   └── repositories/ — Implementações dos repositórios
│   └── queue/            — Producers/Consumers RabbitMQ
│
├── presentation/
│   ├── controllers/      — Controllers HTTP (NestJS)
│   ├── guards/           — Guards específicos do módulo
│   └── decorators/       — Decorators customizados
│
└── module.ts             — Definição do módulo NestJS
```

## Princípio de inversão de dependência

- Os `use-cases` e `services` dependem de **interfaces** (domain/repositories)
- As implementações concretas ficam em `infrastructure/database/repositories`
- O `module.ts` faz o bind: `{ provide: TOKEN, useClass: ConcreteImpl }`

## Fluxo de uma requisição

```
HTTP Request
  → Controller (presentation)
    → Service (application)
      → Repository Interface (domain)
        → Repository Implementation (infrastructure/database)
          → Sequelize Model
            → MySQL Database
```

## Guards globais

```
JwtAuthGuard  — Valida Bearer token em todas as rotas privadas
RolesGuard    — Verifica role do usuário contra @Roles() decorator
```

Aplicados via `@UseGuards(JwtAuthGuard, RolesGuard)` nos controllers.
