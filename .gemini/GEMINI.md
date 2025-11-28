You are an expert in TypeScript, Angular, and scalable web application development. You write maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection


```text
.
├── projects
│   ├── page-builder            # 🛠️ LIBRAIRIE : L'OUTIL RÉUTILISABLE
│   │   └── src
│   │       └── lib
│   │           ├── core/
│   │           │   ├── block-interface.ts 2026        # Le contrat de données
│   │           │   └── style-util.ts 2026             # Fonctions utilitaires (CSS/Tailwind mapping)
│   │           ├── renderer/
│   │           │   └── block-renderer-component.ts 2026 # Le moteur récursif
│   │           └── widgets/
│   │               ├── selection-wrapper-component.ts 2026 # Micro-composant pour Drag & Sélection
│   │               ├── container-widget-component.ts 2026
│   │               └── text-widget-component.ts 2026
│   │
│   ├── builder-admin           # 💻 APPLICATION ADMIN : L'INTERFACE D'ÉDITION
│   │   └── src
│   │       └── app
│   │           ├── services/
│   │           │   ├── local-storage-resource.ts 2026 # La logique Resource/Promise/LocalStorage
│   │           │   └── builder-state-service.ts 2026  # L'état central (Blocks, SelectedId, Undo)
│   │           ├── features/
│   │           │   ├── editor/
│   │           │   │   └── editor-sidebar/
│   │           │   │       ├── editor-sidebar-component.ts 2026 # Le Shell de la Sidebar
│   │           │   │       └── controls/
│   │           │   │           ├── spacing-controls-component.ts 2026 # Micro-composant Padding/Margin
│   │           │   │           └── typography-controls-component.ts 2026 # Micro-composant Font/Color
│   │           │   │   └── editor-routes.ts 2026
│   │           │   └── layout/
│   │           │       └── editor-layout-component.ts 2026 # Le conteneur (Canvas + Sidebar)
│   │           └── app-routes.ts 2026
│   │
│   ├── public-site             # 🌐 APPLICATION PUBLIQUE : LE CONSOMMATEUR
│   │   └── src
│   │       └── app
│   │           ├── services/
│   │           │   └── page-data-resource.ts 2026 # Resource/Promise pour la lecture
│   │           ├── features/
│   │           │   ├── layout/
│   │           │   │   └── main-layout-component.ts 2026
│   │           │   └── page-viewer/
│   │           │       └── page-viewer-component.ts 2026 # Catch-All Route
│   │           └── app-routes.ts 2026 # Avec le 'path: "**"'
```