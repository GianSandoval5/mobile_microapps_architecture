import React from 'react';
import {StatusBar, useColorScheme} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {DemoCompositionRoot} from './CompositionRoot';
import {MicroappsShell} from './MicroappsShell';

type MicroappsDemoAppProps = {
  composition?: DemoCompositionRoot;
};

export function MicroappsDemoApp({
  composition = new DemoCompositionRoot(),
}: MicroappsDemoAppProps) {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <MicroappsShell
        registry={composition.registry}
        session={composition.session}
      />
    </SafeAreaProvider>
  );
}
