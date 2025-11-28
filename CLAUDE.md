# CLAUDE.md - AI Assistant Guide

This document provides comprehensive guidance for AI assistants working on the Fuel Prices API project.

## Project Overview

**Project Name:** Fuel Prices API
**Description:** AdonisJS application to display real-time fuel prices in France using open data sources
**Framework:** AdonisJS v6
**Language:** TypeScript
**Database:** PostgreSQL with Lucid ORM
**Package Manager:** npm (with support for pnpm overrides)

## Tech Stack

- **Backend Framework:** AdonisJS v6.14.1
- **ORM:** Lucid v21.3.0
- **Template Engine:** Edge.js v6.2.0
- **Frontend Bundler:** Vite v5.4.8
- **Authentication:** @adonisjs/auth v9.2.3
- **Session:** @adonisjs/session v7.5.0
- **Validation:** VineJS v2.1.0
- **Testing:** Japa v3 with AdonisJS plugin
- **Database:** PostgreSQL (pg v8.13.1)
- **Date/Time:** Luxon v3.5.0

## Project Structure

```
fuel_prices_api/
├── app/
│   ├── controllers/           # Request handlers
│   │   ├── api/              # API endpoints (JSON responses)
│   │   └── http/             # Web endpoints (Edge templates)
│   ├── exceptions/           # Custom exception handlers
│   ├── middleware/           # HTTP middleware
│   ├── models/              # Lucid ORM models
│   └── services/            # Business logic layer
├── bin/                     # Entry point scripts
├── config/                  # Application configuration files
├── database/
│   └── migrations/          # Database migrations
├── resources/
│   ├── css/                # Stylesheets
│   ├── js/                 # Frontend JavaScript
│   └── views/              # Edge templates
│       ├── components/     # Reusable Edge components
│       ├── pages/          # Page templates
│       └── partials/       # Partial templates
├── start/
│   ├── env.ts             # Environment variable validation
│   ├── kernel.ts          # Middleware registration
│   └── routes.ts          # Route definitions
└── tests/
    ├── unit/              # Unit tests (2s timeout)
    └── functional/        # Functional tests (30s timeout)
```

## Architecture Patterns

### MVC with Service Layer

The application follows a modified MVC pattern:

1. **Controllers** handle HTTP requests/responses
2. **Services** contain business logic
3. **Models** represent database entities
4. **Views** (Edge templates) render HTML

### Dependency Injection

The project uses AdonisJS's IoC container with the `@inject()` decorator:

```typescript
import { inject } from '@adonisjs/fold'

@inject()
export default class StationsApiController {
  constructor(private fuelPriceService: FuelPriceService) {}
  // Service automatically injected
}
```

### Path Aliases

The project uses import aliases defined in `package.json`:

- `#controllers/*` → `./app/controllers/*.js`
- `#models/*` → `./app/models/*.js`
- `#services/*` → `./app/services/*.js`
- `#middleware/*` → `./app/middleware/*.js`
- `#validators/*` → `./app/validators/*.js`
- `#config/*` → `./config/*.js`
- `#database/*` → `./database/*.js`
- `#tests/*` → `./tests/*.js`
- `#start/*` → `./start/*.js`

**Important:** Always use these aliases instead of relative paths when importing.

## Database Models

### Model Conventions

Models use Lucid ORM with decorators:

```typescript
import { DateTime } from 'luxon'
import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class ModelName extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare fieldName: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
```

### Current Models

- `User` - User authentication
- `Stations` - Fuel station locations and details
- `FuelPrices` - Fuel price data
- `FuelTypes` - Types of fuel (Gazole, SP95, etc.)
- `FuelShortages` - Shortage tracking
- `Department` - French departments
- `Regions` - French regions

### Database Naming

- **Tables:** snake_case plural (e.g., `fuel_prices`, `fuel_types`)
- **Columns:** snake_case (e.g., `department_code`, `zip_code`)
- **Models:** PascalCase singular (e.g., `FuelPrices`, `Stations`)

## Routing

Routes are defined in `start/routes.ts`:

### HTTP Routes (HTML Views)
```typescript
router.get('/', [DepartmentsController, 'index'])
router.get('/stations/search', [StationsController, 'search'])
```

### API Routes (JSON)
```typescript
router.group(() => {
  router.get('/departments', [DepartmentsApiController, 'index'])
  router.get('/stations/search', [StationsApiController, 'search'])
  router.get('/cities/search', [CitiesApiController, 'search'])
}).prefix('/api')
```

### Route Conventions

- **HTTP controllers** return Edge template views
- **API controllers** return JSON responses
- Use lazy loading for controllers: `() => import('#controllers/...')`
- Group related routes with `.group()` and `.prefix()`

## Services Layer

Services contain business logic and database queries:

```typescript
import { inject } from '@adonisjs/fold'
import db from '@adonisjs/lucid/services/db'

@inject()
export default class FuelPriceService {
  constructor() {}

  public async getAveragePricesByDepartment() {
    return await db
      .query()
      .from('fuel_prices')
      .join('stations', 'stations.id', 'fuel_prices.station_id')
      // ... query logic
  }
}
```

### Service Conventions

- Use dependency injection with `@inject()`
- Prefix service methods with clear action verbs (get, create, update, delete)
- Handle errors within services and throw meaningful exceptions
- Use the query builder (`db.query()`) for complex queries
- Use models for simple CRUD operations

## Controllers

### API Controller Pattern

```typescript
import { HttpContext } from '@adonisjs/core/http'
import { inject } from '@adonisjs/fold'

@inject()
export default class StationsApiController {
  constructor(private fuelPriceService: FuelPriceService) {}

  public async search({ request, response }: HttpContext) {
    const { searchTerm } = request.qs()

    // Validation
    if (!searchTerm || searchTerm.length < 2) {
      return response.status(400).json({
        status: 'error',
        message: 'Validation error message',
      })
    }

    try {
      const data = await this.fuelPriceService.method(searchTerm)
      return response.json({ status: 'success', data })
    } catch (error) {
      return response.status(500).json({
        status: 'error',
        message: 'Error message',
      })
    }
  }
}
```

### Controller Conventions

- API controllers return JSON with `{ status: 'success'|'error', data|message }`
- HTTP controllers use `view.render()` for Edge templates
- Keep controllers thin - delegate logic to services
- Use destructuring for `HttpContext`: `{ request, response, view }`

## Environment Configuration

### Environment Variables

Defined in `.env.example`:

```env
TZ=UTC
PORT=3333
HOST=localhost
LOG_LEVEL=info
APP_KEY=
NODE_ENV=development
SESSION_DRIVER=cookie
DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=root
DB_PASSWORD=root
DB_DATABASE=app
```

### Adding New Environment Variables

1. Add to `.env.example` with empty/default value
2. Update `start/env.ts` with validation rules
3. Use in code via `import env from '#start/env'`

## Code Style & Formatting

### EditorConfig Settings

- **Indent:** 2 spaces
- **Line endings:** LF
- **Charset:** UTF-8
- **Trim trailing whitespace:** Yes
- **Final newline:** Yes

### Linting & Formatting

- **ESLint:** Uses `@adonisjs/eslint-config`
- **Prettier:** Uses `@adonisjs/prettier-config`
- Run `npm run lint` to check
- Run `npm run format` to auto-format

### TypeScript

- Extends `@adonisjs/tsconfig/tsconfig.app.json`
- Output directory: `./build`
- Use TypeScript strict mode
- Always declare types explicitly

## Development Workflows

### Available Scripts

```bash
npm run dev        # Start development server with HMR
npm run build      # Build for production
npm start          # Start production server
npm test           # Run tests
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
npm run typecheck  # Type check without emitting
```

### Hot Module Replacement (HMR)

HMR is enabled for:
- `./app/controllers/**/*.ts`
- `./app/middleware/*.ts`

Changes to these files will reload automatically without restarting the server.

### Database Migrations

```bash
node ace migration:run         # Run pending migrations
node ace migration:rollback    # Rollback last batch
node ace migration:status      # Check migration status
node ace make:migration name   # Create new migration
```

### Migration Conventions

- Use descriptive names: `create_fuel_prices_table`
- Always define both `up()` and `down()` methods
- Use `this.schema.createTable()` and `this.schema.dropTable()`
- Define foreign keys with proper constraints

## Testing

### Test Structure

- **Unit tests:** `tests/unit/**/*.spec.ts` (2s timeout)
- **Functional tests:** `tests/functional/**/*.spec.ts` (30s timeout)

### Running Tests

```bash
npm test                    # Run all tests
node ace test unit         # Run unit tests only
node ace test functional   # Run functional tests only
```

### Test Framework

Uses Japa v3 with:
- `@japa/assert` for assertions
- `@japa/plugin-adonisjs` for AdonisJS integration

## Important Notes for AI Assistants

### Always Follow These Rules

1. **Use Path Aliases:** Always use `#controllers`, `#models`, etc. instead of relative imports
2. **Dependency Injection:** Use `@inject()` decorator for service dependencies
3. **Database Queries:**
   - Use query builder for complex queries
   - Use models for simple CRUD
   - Always use parameterized queries to prevent SQL injection
4. **Error Handling:** Wrap database operations in try-catch blocks
5. **TypeScript:** Use `declare` keyword for class properties with decorators
6. **Naming:**
   - Files: snake_case.ts
   - Classes: PascalCase
   - Variables/functions: camelCase
   - Database tables: snake_case_plural
   - Database columns: snake_case

### When Making Changes

1. **Read First:** Always read existing files before modifying
2. **Maintain Patterns:** Follow existing architectural patterns
3. **Services Over Controllers:** Put business logic in services, not controllers
4. **Validate Input:** Always validate user input in controllers
5. **Type Safety:** Maintain strict TypeScript typing
6. **Migrations:** Create migrations for any database schema changes
7. **Documentation:** Update this file if architecture patterns change

### Code Security

- Never commit `.env` files (already in `.gitignore`)
- Use parameterized queries to prevent SQL injection
- Validate all user input
- Use Shield middleware for CSRF protection (already configured)
- Don't expose sensitive error details in API responses

### Common Pitfalls to Avoid

1. ❌ Don't use relative imports → ✅ Use path aliases
2. ❌ Don't put business logic in controllers → ✅ Use services
3. ❌ Don't use `require()` → ✅ Use ES6 `import`
4. ❌ Don't use `.js` in imports → ✅ Use `.ts` (TypeScript handles it)
5. ❌ Don't forget `declare` keyword in models → ✅ Always use it
6. ❌ Don't use `console.log()` for errors → ✅ Use proper error handling

### Database Query Best Practices

```typescript
// ✅ Good: Parameterized query
.where('city', 'ilike', `%${searchTerm}%`)

// ❌ Bad: String concatenation (SQL injection risk)
.whereRaw(`city ILIKE '%${searchTerm}%'`)

// ✅ Good: Use db.raw() with bindings
db.raw('ROUND(AVG(price)::numeric, 3)')

// ✅ Good: Group related data
const grouped = results.reduce((acc, item) => {
  // grouping logic
}, {})
```

### API Response Format

Always use consistent response format:

```typescript
// Success
return response.json({
  status: 'success',
  data: results
})

// Error
return response.status(400).json({
  status: 'error',
  message: 'User-friendly error message'
})
```

## Project-Specific Context

### Domain: Fuel Prices in France

- **Departments:** French administrative divisions (codes like "75" for Paris)
- **Regions:** Larger administrative divisions containing departments
- **Stations:** Physical fuel stations with location data (lat/long, address)
- **Fuel Types:** Different fuel types (Gazole, SP95, SP98, E10, etc.)
- **Price Data:** Time-series price data for different fuels at stations

### Key Business Logic

1. **Price Aggregation:** Calculate average prices by department and fuel type
2. **Station Search:** Find stations by city name or zip code
3. **Geolocation:** Store and query location data (currently has TODO for geometry type)
4. **24/7 Tracking:** Track which stations are open 24 hours

### French Language

- UI messages and error responses are in French
- Database data (city names, addresses) are in French
- Keep consistent with existing French language usage

## Future Considerations

Based on code analysis, potential areas for expansion:

1. **Geometry Handling:** TODO in `stations.ts` for proper PostGIS geometry type
2. **Authentication:** Auth is configured but not fully implemented
3. **Fuel Shortages:** Model exists but not integrated into API
4. **Testing:** Test structure is set up but needs test cases
5. **API Documentation:** Consider adding OpenAPI/Swagger docs

## Version Information

- **AdonisJS:** v6.14.1
- **Node.js:** Use LTS version (check `package.json` for compatibility)
- **TypeScript:** ~5.6
- **Database:** PostgreSQL (compatible with latest stable)

## Getting Started for AI Assistants

When starting work on this project:

1. Check `start/routes.ts` to understand available endpoints
2. Review models in `app/models/` to understand data structure
3. Examine services in `app/services/` for business logic patterns
4. Look at existing controllers for response format conventions
5. Check `.env.example` for required environment variables
6. Review this document before making architectural decisions

## Questions to Ask Before Making Changes

- Does this follow the existing service/controller pattern?
- Should this be in a service or controller?
- Am I using the correct path alias?
- Is this query safe from SQL injection?
- Does this maintain the existing API response format?
- Do I need to create a migration for this?
- Is input validation needed?
- Should this be an HTTP route or API route?

---

**Last Updated:** 2025-11-28
**Project Status:** Active Development
**Maintainer:** Review git log for current maintainers
