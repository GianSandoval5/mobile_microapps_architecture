# React Native Microapps Architecture

## Composition model

The shell is the only place that knows every module. Modules expose route metadata and a screen component through `MicroAppModule`.

```mermaid
sequenceDiagram
  participant App as App.tsx
  participant Root as DemoCompositionRoot
  participant Registry as ModuleRegistry
  participant Shell as MicroappsShell
  participant Module as MicroAppModule

  App->>Root: create shared dependencies
  Root->>Registry: register module instances
  App->>Shell: pass registry and session
  Shell->>Registry: resolve selected route
  Registry->>Module: route.component
```

## Dependency rules

```text
Allowed:
  app_shell -> feature modules
  feature modules -> module_contracts
  feature modules -> shared_ui
  feature modules -> core_network when API access is needed

Avoid:
  payments_module -> auth_module
  profile_module -> auth_module
  insurance_module -> payments_module
  shared_ui -> feature modules
  core_network -> feature modules
```

## Package responsibilities

- `module_contracts`: stable interfaces for modules, routes, registry and session.
- `core_network`: shared network boundary. The demo uses `FakeEnterpriseGateway`.
- `shared_ui`: reusable design primitives.
- `auth_module`: owns session entry points.
- `payments_module`: owns the transfer flow.
- `insurance_module`: owns quote logic.
- `profile_module`: reads identity through `SessionContract`.

## Transactional feature flow

```mermaid
flowchart TD
  User[User opens Payments]
  Session{SessionContract authenticated?}
  Form[Transfer form]
  Gateway[core_network NetworkClient]
  Receipt[Approved receipt]

  User --> Session
  Session -- no --> Disabled[Submit disabled]
  Session -- yes --> Form
  Form --> Gateway
  Gateway --> Receipt
```

Payments never imports Auth. It only reads the session through the shared contract.
