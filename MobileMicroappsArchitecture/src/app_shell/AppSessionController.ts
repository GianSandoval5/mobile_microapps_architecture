import {
  SessionContract,
  SessionListener,
  SessionUser,
} from '../packages/module_contracts';

const demoUser: SessionUser = {
  id: 'customer-1001',
  name: 'Gian Sandoval',
  role: 'Enterprise customer',
  segment: 'Premium',
};

export class AppSessionController implements SessionContract {
  private user: SessionUser | null = demoUser;
  private listeners = new Set<SessionListener>();

  currentUser() {
    return this.user;
  }

  isAuthenticated() {
    return this.user !== null;
  }

  subscribe(listener: SessionListener) {
    this.listeners.add(listener);
    listener(this.user);

    return () => {
      this.listeners.delete(listener);
    };
  }

  async signInAsDemoUser() {
    this.user = demoUser;
    this.notify();
  }

  async signOut() {
    this.user = null;
    this.notify();
  }

  private notify() {
    for (const listener of this.listeners) {
      listener(this.user);
    }
  }
}
