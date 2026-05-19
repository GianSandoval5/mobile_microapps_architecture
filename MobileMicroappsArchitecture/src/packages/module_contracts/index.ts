import {useEffect, useState} from 'react';
import type {ComponentType} from 'react';

export type SessionUser = {
  id: string;
  name: string;
  role: string;
  segment: string;
};

export type SessionListener = (user: SessionUser | null) => void;

export type SessionContract = {
  currentUser(): SessionUser | null;
  isAuthenticated(): boolean;
  subscribe(listener: SessionListener): () => void;
  signInAsDemoUser(): Promise<void>;
  signOut(): Promise<void>;
};

export type ModuleDependency = {
  name: string;
  reason: string;
};

export type MicroAppRoute = {
  path: string;
  title: string;
  component: ComponentType;
};

export type MicroAppModule = {
  id: string;
  name: string;
  description: string;
  icon: string;
  initialRoute: string;
  routes: MicroAppRoute[];
  dependencies: ModuleDependency[];
};

export class ModuleRegistry {
  constructor(private readonly registeredModules: MicroAppModule[]) {}

  get modules() {
    return this.registeredModules;
  }

  get routes() {
    return this.registeredModules.flatMap(module => module.routes);
  }

  get initialRoute() {
    return this.registeredModules[0].routes[0];
  }

  routeByPath(path: string) {
    return this.routes.find(route => route.path === path) ?? this.initialRoute;
  }

  moduleForRoute(path: string) {
    return (
      this.registeredModules.find(module =>
        module.routes.some(route => route.path === path),
      ) ?? this.registeredModules[0]
    );
  }
}

export function useSessionUser(session: SessionContract) {
  const [user, setUser] = useState<SessionUser | null>(session.currentUser());

  useEffect(() => session.subscribe(setUser), [session]);

  return user;
}
