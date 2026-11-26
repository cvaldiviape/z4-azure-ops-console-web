# ops-console-web

Consola técnica de Z4 para seguir las Sagas de compra y, más adelante, la bandeja DLT. Solo entran usuarios con rol `ADMIN`. Angular 22 + Angular Material, con CSS propio y el `grid.css` de 12 columnas.

## Requisitos

| #   | Qué           | Versión | Cómo                                                                |
|-----|---------------|---------|---------------------------------------------------------------------|
| 1   | Node          | 26 LTS  | `nvm install --lts` (Angular 22 no acepta Node 21)                  |
| 2   | Angular CLI   | 22      | `npm install -g @angular/cli@22`                                    |
| 3   | Backend       | —       | Docker arriba, auth-service (8081) y order-service (8082) corriendo |
| 4   | Usuario ADMIN | —       | Fila en `user_roles` de `auth_db` con el rol `ADMIN`                |

## Ejecutar

```bash
npm install
```

```bash
npm start
```

Abre `http://localhost:4200`. Las URLs de cada servicio están en `src/environments/environment.development.ts`.

## Pruebas y build

```bash
npm test
```

```bash
npm run build
```

## Estructura

| #   | Carpeta                   | Qué contiene                                                            |
|-----|---------------------------|-------------------------------------------------------------------------|
| 1   | `src/styles/`             | `variables.css`, `base.css`, `grid.css`, `status.css`, `material.css`   |
| 2   | `app/security/`           | `jwt.service`, interceptores (JWT y errores), guards (`admin`, `guest`) |
| 3   | `app/router/{auth,admin}` | Un área por tipo de usuario, cada una con su layout                     |
| 4   | `app/modules/<x>/`        | `components/`, `services/`, `static/path-rest.ts` y `<x>.routes.ts`     |
| 5   | `app/models/`             | DTOs (`request`, `response`), claims del JWT, ítems del menú, tipos     |
| 6   | `app/shared/`             | Layouts, sidebar con submenú, navbar, `loading-button`, `snack-bar`     |

## Convenciones

- Componentes standalone con `OnPush`, `input()` / `output()`, signals y `@if` / `@for`.
- Dependencias con `inject()`; las privadas llevan `_` (`private readonly _http = inject(HttpClient)`).
- Estilos en el `.css` de cada componente, con clases BEM (`sidebar__item--active`). Nada de estilos en el HTML.
- Responsive con `grid.css`: `row` y `col-12 sm:col-6 lg:col-3`.
- Parámetros de ruta y query params llegan como `input()` (`withComponentInputBinding`).
