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
  MetricTile,
  ModulePage,
  StatusPill,
} from '../shared_ui';

type InsuranceModuleDependencies = {
  session: SessionContract;
  network: NetworkClient;
};

export function createInsuranceModule({
  session,
  network,
}: InsuranceModuleDependencies): MicroAppModule {
  return {
    id: 'insurance',
    name: 'Insurance',
    description: 'Demonstrates a bounded product module that can quote coverage independently.',
    icon: 'I',
    initialRoute: '/insurance',
    dependencies: [
      {name: 'module_contracts', reason: 'Reads customer segment from SessionContract.'},
      {name: 'core_network', reason: 'Requests a mocked quote.'},
      {name: 'shared_ui', reason: 'Reuses design primitives.'},
    ],
    routes: [
      {
        path: '/insurance',
        title: 'Insurance',
        component: () => <InsuranceScreen session={session} network={network} />,
      },
    ],
  };
}

function InsuranceScreen({session, network}: InsuranceModuleDependencies) {
  const user = useSessionUser(session);
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<Record<string, unknown> | null>(null);

  async function quoteCoverage() {
    setLoading(true);
    const response = await network.send({method: 'GET', path: '/insurance/quote'});
    setQuote(response.data);
    setLoading(false);
  }

  return (
    <ModulePage
      title="Insurance microapp"
      description="A product module can evolve independently while still consuming shared platform contracts.">
      <ArchitectureCard
        title="Coverage quote"
        subtitle="Uses the same network boundary as Payments, but owns its own feature model.">
        <View style={styles.metrics}>
          <MetricTile label="Customer segment" value={user?.segment ?? 'Guest'} />
          <MetricTile label="Policy modules" value="2" />
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={loading}
          onPress={quoteCoverage}
          style={({pressed}) => [
            styles.button,
            pressed && styles.buttonPressed,
            loading && styles.buttonDisabled,
          ]}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : null}
          <Text style={styles.buttonText}>Get quote</Text>
        </Pressable>
        {quote ? (
          <StatusPill
            label={`${quote.coverage} - $${quote.monthlyFee} / month`}
            tone="accent"
          />
        ) : null}
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
  metrics: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
});
