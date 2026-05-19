import React from 'react';
import {View} from 'react-native';

import {
  MicroAppModule,
  SessionContract,
  useSessionUser,
} from '../module_contracts';
import {ArchitectureCard, MetricTile, ModulePage} from '../shared_ui';

type ProfileModuleDependencies = {
  session: SessionContract;
};

export function createProfileModule({
  session,
}: ProfileModuleDependencies): MicroAppModule {
  return {
    id: 'profile',
    name: 'Profile',
    description: 'Reads customer identity through SessionContract without importing auth_module.',
    icon: 'P',
    initialRoute: '/profile',
    dependencies: [
      {
        name: 'module_contracts',
        reason: 'Consumes SessionContract as a read-only identity boundary.',
      },
      {name: 'shared_ui', reason: 'Uses reusable enterprise UI primitives.'},
    ],
    routes: [
      {
        path: '/profile',
        title: 'Profile',
        component: () => <ProfileScreen session={session} />,
      },
    ],
  };
}

function ProfileScreen({session}: ProfileModuleDependencies) {
  const user = useSessionUser(session);

  return (
    <ModulePage
      title="Profile microapp"
      description="The module renders customer profile data from a contract owned by the shell composition root.">
      <ArchitectureCard
        title={user ? user.name : 'Guest profile'}
        subtitle={user ? `${user.segment} segment - ${user.role}` : 'Sign in from Auth to see a composed customer context.'}>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 12}}>
          <MetricTile label="Profile completeness" value="92%" />
          <MetricTile label="Shared contracts" value="3" />
          <MetricTile label="Module imports" value="0 auth" />
        </View>
      </ArchitectureCard>
    </ModulePage>
  );
}
