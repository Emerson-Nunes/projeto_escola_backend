# Módulo Auth

## Endpoints

| Método | Rota        | Proteção | Descrição              |
|--------|-------------|----------|------------------------|
| POST   | /auth/login | Público  | Autenticar usuário     |
| GET    | /auth/me    | JWT      | Dados do usuário logado|

## Login Request/Response

### Request
```json
{ "email": "admin@escola.com", "password": "Admin@123" }
```

### Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiJ9...",
  "user": { "id": "uuid", "name": "Administrador", "email": "admin@escola.com", "role": "ADMIN" }
}
```

## JWT Payload
```json
{ "sub": "user-uuid", "email": "email@escola.com", "role": "ADMIN" }
```

## Guards

### JwtAuthGuard
- Valida `Authorization: Bearer <token>` em todas as rotas privadas
- Extrai o usuário do token e injeta em `request.user`

### RolesGuard
- Verifica se `request.user.role` está na lista do decorator `@Roles()`
- Se `@Roles()` não estiver presente, qualquer role autenticada passa

## Uso nos controllers

```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN, Role.PROFESSOR)
@Get('rota-protegida')
minhaRota(@CurrentUser() user: any) { ... }
```

## Decorator @CurrentUser()

Extrai o usuário autenticado do request:
```typescript
@Get('me')
@UseGuards(JwtAuthGuard)
me(@CurrentUser() user: { id: string; email: string; role: Role }) { ... }
```
