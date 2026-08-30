# Requena Labs Supply

Frontend e-commerce zoneless en Angular 21, standalone components y estado con signals. La interfaz usa Transloco (`es` por defecto, `en` alternativo), tema oscuro/claro y consume el backend NestJS.

## Desarrollo

```bash
pnpm install
pnpm start
```

La API de desarrollo se configura en `src/environments/environment.ts`:

```ts
apiUrl: 'http://localhost:3000/api'
```

Producción usa `https://requena-labs-api.onrender.com/api`.

## Compilar y desplegar

```bash
pnpm build
pnpm deploy
```

`pnpm deploy` genera la aplicación con base `/responsive-store/` y publica el contenido compilado para GitHub Pages.

## Cuenta administrativa de demostración

- Correo: `admin@requenalabs.supply`
- Contraseña: `Admin123!`

También hay un cliente de demo: `demo@requenalabs.supply` / `Demo123!`.

Las credenciales deben existir en el seed del backend. Nunca se incluyen tokens ni secretos en este repositorio.
