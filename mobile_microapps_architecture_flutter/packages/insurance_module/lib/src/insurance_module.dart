import 'package:core_network/core_network.dart';
import 'package:flutter/material.dart';
import 'package:module_contracts/module_contracts.dart';
import 'package:shared_ui/shared_ui.dart';

final class InsuranceModule implements MicroAppModule {
  InsuranceModule({
    required SessionContract session,
    required NetworkClient network,
  })  : _session = session,
        _network = network;

  final SessionContract _session;
  final NetworkClient _network;

  @override
  String get id => 'insurance';

  @override
  String get name => 'Insurance';

  @override
  String get description => 'Demonstrates a bounded product module that can quote coverage independently.';

  @override
  IconData get icon => Icons.health_and_safety_outlined;

  @override
  String get initialRoute => '/insurance';

  @override
  List<ModuleDependency> get dependencies => const [
    ModuleDependency(name: 'module_contracts', reason: 'Reads customer segment from SessionContract.'),
    ModuleDependency(name: 'core_network', reason: 'Requests a mocked quote.'),
    ModuleDependency(name: 'shared_ui', reason: 'Reuses design primitives.'),
  ];

  @override
  List<MicroAppRoute> get routes => [
    MicroAppRoute(
      path: initialRoute,
      title: 'Insurance',
      builder: (_) => InsuranceHomePage(session: _session, network: _network),
    ),
  ];
}

final class InsuranceHomePage extends StatefulWidget {
  const InsuranceHomePage({
    required this.session,
    required this.network,
    super.key,
  });

  final SessionContract session;
  final NetworkClient network;

  @override
  State<InsuranceHomePage> createState() => _InsuranceHomePageState();
}

final class _InsuranceHomePageState extends State<InsuranceHomePage> {
  bool _loading = false;
  Map<String, Object?>? _quote;

  Future<void> _quoteCoverage() async {
    setState(() => _loading = true);
    final response = await widget.network.send(
      const NetworkRequest(method: 'GET', path: '/insurance/quote'),
    );
    setState(() {
      _loading = false;
      _quote = response.data;
    });
  }

  @override
  Widget build(BuildContext context) {
    return ModulePage(
      title: 'Insurance microapp',
      description: 'A product module can evolve independently while still consuming shared platform contracts.',
      children: [
        ArchitectureCard(
          title: 'Coverage quote',
          subtitle: 'Uses the same network boundary as Payments, but owns its own feature model.',
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Wrap(
                spacing: 12,
                runSpacing: 12,
                children: [
                  MetricTile(label: 'Customer segment', value: widget.session.user?.segment ?? 'Guest', icon: Icons.groups_outlined),
                  const MetricTile(label: 'Policy modules', value: '2', icon: Icons.inventory_2_outlined),
                ],
              ),
              const SizedBox(height: 16),
              FilledButton.icon(
                onPressed: _loading ? null : _quoteCoverage,
                icon: _loading
                    ? const SizedBox.square(dimension: 16, child: CircularProgressIndicator(strokeWidth: 2))
                    : const Icon(Icons.request_quote_outlined),
                label: const Text('Get quote'),
              ),
              if (_quote != null) ...[
                const SizedBox(height: 16),
                StatusPill(
                  label: '${_quote!['coverage']} · \$${_quote!['monthlyFee']} / month',
                  color: AppColors.accent,
                ),
              ],
            ],
          ),
        ),
      ],
    );
  }
}
