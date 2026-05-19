import React, {useState} from 'react';
import {ActivityIndicator, Pressable, StyleSheet, Text, View} from 'react-native';

import {NetworkClient} from '../core_network';
import {
  MicroAppModule,
  SessionContract,
  useSessionUser,
} from '../module_contracts';
import {
  ArchitectureCard,
  colors,
  ModulePage,
  StatusPill,
} from '../shared_ui';

type AuthModuleDependencies = {
  session: SessionContract;
  network: NetworkClient;
};

export function createAuthModule({
  session,
  network,
}: AuthModuleDependencies): MicroAppModule {
  return {
    id: 'auth',
    name: 'Auth',
    description: 'Owns demo identity, session state and authentication entry points.',
    icon: 'A',
    initialRoute: '/auth',
    dependencies: [
      {name: 'module_contracts', reason: 'Reads and mutates SessionContract.'},
      {name: 'core_network', reason: 'Requests a mocked enterprise session.'},
      {name: 'shared_ui', reason: 'Uses design system cards and status styles.'},
    ],
    routes: [
      {
        path: '/auth',
        title: 'Authentication',
        component: () => <AuthScreen session={session} network={network} />,
      },
    ],
  };
}

function AuthScreen({session, network}: AuthModuleDependencies) {
  const user = useSessionUser(session);
  const [loading, setLoading] = useState(false);
  const [scope, setScope] = useState<string | null>(null);

  async function toggleSession() {
    setLoading(true);

    if (user) {
      await session.signOut();
      setScope(null);
    } else {
      const response = await network.send({method: 'POST', path: '/auth/session'});
      await session.signInAsDemoUser();
      setScope(String(response.data.scope ?? 'customer:read'));
    }

    setLoading(false);
  }

  return (
    <ModulePage
      title="Authentication microapp"
      description="Session logic is exposed through a contract so the shell and other modules do not import auth internals.">
      <ArchitectureCard
        title={user ? 'Active enterprise session' : 'No active session'}
        subtitle={user ? `${user.name} - ${user.role}` : 'Tap sign in to hydrate the shared session contract.'}>
        <View style={styles.pills}>
          <StatusPill label={user ? 'authenticated' : 'anonymous'} />
          {scope ? <StatusPill label={scope} tone="accent" /> : null}
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={loading}
          onPress={toggleSession}
          style={({pressed}) => [
            styles.button,
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled,
          ]}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : null}
          <Text style={styles.buttonText}>{user ? 'Sign out' : 'Sign in as demo user'}</Text>
        </Pressable>
      </ArchitectureCard>
    </ModulePage>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: colors.brand,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
