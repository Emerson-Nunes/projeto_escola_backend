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
ThrottlerGuard — Rate limiting global (120 req/min); login: 5 req/min
```

Aplicados via `@UseGuards(JwtAuthGuard, RolesGuard)` nos controllers.
`ThrottlerGuard` é registrado como `APP_GUARD` global em `AppModule`.

## Segurança — Camadas de defesa

### Por que SQL Injection já está protegido nativamente

O Sequelize ORM usa **prepared statements / parameterized queries** para 100% das operações de banco. Nenhuma chamada `sequelize.query()` com concatenação de string existe no projeto. O `Op.like` gera `WHERE name LIKE ?` com binding separado — o valor nunca é interpolado no SQL.

### Defesas adicionais implementadas (defense-in-depth)

| Camada | Mecanismo | Localização |
|--------|-----------|-------------|
| HTTP Headers | `helmet` — CSP, X-Frame-Options, HSTS, X-Content-Type-Options, etc. | `main.ts` |
| Rate Limiting | `@nestjs/throttler` — 120 req/min global; 5 req/min no `/auth/login` | `app.module.ts`, `auth.controller.ts` |
| CORS restrito | `CORS_ORIGIN` env var (default: `http://localhost:5173`), não `*` | `main.ts` |
| DTO Whitelist | `ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })` — rejeita campos desconhecidos com HTTP 400 | `main.ts` |
| MaxLength | `@MaxLength()` em todos os campos de string nos DTOs — bloqueia payloads excessivos | DTOs de cada módulo |
| Search MaxLength | `@MaxLength(100)` no campo `search` do `PaginationDto` | `shared/dto/pagination.dto.ts` |
| LIKE Escaping | `escapeLike()` escapa `%`, `_` e `\` antes de usar em `Op.like` — evita wildcard injection | `shared/utils/escape-like.util.ts` |
| JWT DB-check | `JwtStrategy.validate()` consulta o banco a cada request — sessões de usuários deletados expiram imediatamente | `auth/infrastructure/strategies/jwt.strategy.ts` |

### CORS_ORIGIN em produção

Adicionar ao `.env` de produção:
```
CORS_ORIGIN=https://meu-dominio.com
```

### Rate limiting — comportamento

- **Global**: 120 requests por IP por minuto em qualquer endpoint
- **Login**: 5 requests por IP por minuto — após isso, HTTP 429 `Too Many Requests`
- Para rotas de leitura frequente (ex: `/auth/me`), use `@SkipThrottle()` no controller
