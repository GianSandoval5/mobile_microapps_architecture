import React, {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

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

type PaymentsModuleDependencies = {
  session: SessionContract;
  network: NetworkClient;
};

export function createPaymentsModule({
  session,
  network,
}: PaymentsModuleDependencies): MicroAppModule {
  return {
    id: 'payments',
    name: 'Payments',
    description: 'Owns money movement screens and uses shared network/session contracts.',
    icon: '$',
    initialRoute: '/payments',
    dependencies: [
      {name: 'module_contracts', reason: 'Requires an authenticated SessionContract.'},
      {name: 'core_network', reason: 'Submits the transfer through NetworkClient.'},
      {name: 'shared_ui', reason: 'Keeps transaction UI consistent with other modules.'},
    ],
    routes: [
      {
        path: '/payments',
        title: 'Payments',
        component: () => <PaymentsScreen session={session} network={network} />,
      },
    ],
  };
}

function PaymentsScreen({session, network}: PaymentsModuleDependencies) {
  const user = useSessionUser(session);
  const [beneficiary, setBeneficiary] = useState('ACME Insurance Co.');
  const [amount, setAmount] = useState('128.45');
  const [submitting, setSubmitting] = useState(false);
  const [receiptId, setReceiptId] = useState<string | null>(null);

  async function submitPayment() {
    setSubmitting(true);
    setReceiptId(null);

    const response = await network.send({
      method: 'POST',
      path: '/payments/transfer',
      body: {amount, beneficiary, userId: user?.id},
    });

    setReceiptId(String(response.data.receiptId ?? 'approved'));
    setSubmitting(false);
  }

  return (
    <ModulePage
      title="Payments microapp"
      description="A transactional feature with local state, validation boundary and a core_network gateway call.">
      <ArchitectureCard
        title="Transfer flow"
        subtitle="Payments owns this flow. The shell only mounts the route.">
        <TextInput
          onChangeText={setBeneficiary}
          placeholder="Beneficiary"
          style={styles.input}
          value={beneficiary}
        />
        <TextInput
          keyboardType="decimal-pad"
          onChangeText={setAmount}
          placeholder="Amount"
          style={styles.input}
          value={amount}
        />
        <View style={styles.pills}>
          <StatusPill label={user ? 'session verified' : 'requires auth'} />
          <StatusPill label="risk: low" tone="success" />
        </View>
        <Pressable
          accessibilityRole="button"
          disabled={submitting || !user}
          onPress={submitPayment}
          style={({pressed}) => [
            styles.button,
            pressed && styles.buttonPressed,
            (submitting || !user) && styles.buttonDisabled,
          ]}>
          {submitting ? <ActivityIndicator color="#FFFFFF" /> : null}
          <Text style={styles.buttonText}>Submit transfer</Text>
        </Pressable>
        {receiptId ? (
          <StatusPill label={`approved receipt ${receiptId}`} tone="success" />
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
    opacity: 0.55,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: colors.border,
    borderRadius: 8,
    borderWidth: 1,
    color: colors.ink,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  pills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
