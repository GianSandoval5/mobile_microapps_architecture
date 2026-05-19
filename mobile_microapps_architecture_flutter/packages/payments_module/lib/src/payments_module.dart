import 'package:core_network/core_network.dart';
import 'package:flutter/material.dart';
import 'package:module_contracts/module_contracts.dart';
import 'package:shared_ui/shared_ui.dart';

final class PaymentsModule implements MicroAppModule {
  PaymentsModule({
    required SessionContract session,
    required NetworkClient network,
  })  : _session = session,
        _network = network;

  final SessionContract _session;
  final NetworkClient _network;

  @override
  String get id => 'payments';

  @override
  String get name => 'Payments';

  @override
  String get description => 'Owns money movement screens and uses shared network/session contracts.';

  @override
  IconData get icon => Icons.payments_outlined;

  @override
  String get initialRoute => '/payments';

  @override
  List<ModuleDependency> get dependencies => const [
    ModuleDependency(name: 'module_contracts', reason: 'Requires an authenticated SessionContract.'),
    ModuleDependency(name: 'core_network', reason: 'Submits the transfer through NetworkClient.'),
    ModuleDependency(name: 'shared_ui', reason: 'Keeps transaction UI consistent with other modules.'),
  ];

  @override
  List<MicroAppRoute> get routes => [
    MicroAppRoute(
      path: initialRoute,
      title: 'Payments',
      builder: (_) => PaymentsHomePage(session: _session, network: _network),
    ),
  ];
}

final class PaymentsHomePage extends StatefulWidget {
  const PaymentsHomePage({
    required this.session,
    required this.network,
    super.key,
  });

  final SessionContract session;
  final NetworkClient network;

  @override
  State<PaymentsHomePage> createState() => _PaymentsHomePageState();
}

final class _PaymentsHomePageState extends State<PaymentsHomePage> {
  final _beneficiaryController = TextEditingController(text: 'ACME Insurance Co.');
  final _amountController = TextEditingController(text: '128.45');
  bool _submitting = false;
  String? _receiptId;

  @override
  void dispose() {
    _beneficiaryController.dispose();
    _amountController.dispose();
    super.dispose();
  }

  Future<void> _submitPayment() async {
    setState(() {
      _submitting = true;
      _receiptId = null;
    });
    final response = await widget.network.send(
      NetworkRequest(
        method: 'POST',
        path: '/payments/transfer',
        body: {
          'beneficiary': _beneficiaryController.text,
          'amount': _amountController.text,
          'userId': widget.session.user?.id,
        },
      ),
    );
    setState(() {
      _submitting = false;
      _receiptId = response.data['receiptId'] as String?;
    });
  }

  @override
  Widget build(BuildContext context) {
    return ModulePage(
      title: 'Payments microapp',
      description: 'A transactional feature with local state, validation boundary and a core_network gateway call.',
      children: [
        ArchitectureCard(
          title: 'Transfer flow',
          subtitle: 'Payments owns this flow. The shell only mounts the route.',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              TextField(
                controller: _beneficiaryController,
                decoration: const InputDecoration(labelText: 'Beneficiary'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: _amountController,
                keyboardType: TextInputType.number,
                decoration: const InputDecoration(labelText: 'Amount'),
              ),
              const SizedBox(height: 16),
              Wrap(
                spacing: 8,
                runSpacing: 8,
                children: [
                  StatusPill(label: widget.session.isAuthenticated ? 'session verified' : 'requires auth'),
                  const StatusPill(label: 'risk: low', color: AppColors.success),
                ],
              ),
              const SizedBox(height: 16),
              FilledButton.icon(
                onPressed: _submitting || !widget.session.isAuthenticated ? null : _submitPayment,
                icon: _submitting
                    ? const SizedBox.square(dimension: 16, child: CircularProgressIndicator(strokeWidth: 2))
                    : const Icon(Icons.send_outlined),
                label: const Text('Submit transfer'),
              ),
              if (_receiptId != null) ...[
                const SizedBox(height: 16),
                StatusPill(label: 'approved receipt $_receiptId', color: AppColors.success),
              ],
            ],
          ),
        ),
      ],
    );
  }
}
