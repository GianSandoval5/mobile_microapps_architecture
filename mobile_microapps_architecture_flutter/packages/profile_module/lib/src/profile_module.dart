import 'package:flutter/material.dart';
import 'package:module_contracts/module_contracts.dart';
import 'package:shared_ui/shared_ui.dart';

final class ProfileModule implements MicroAppModule {
  ProfileModule({required SessionContract session}) : _session = session;

  final SessionContract _session;

  @override
  String get id => 'profile';

  @override
  String get name => 'Profile';

  @override
  String get description => 'Reads customer identity through SessionContract without importing auth_module.';

  @override
  IconData get icon => Icons.account_circle_outlined;

  @override
  String get initialRoute => '/profile';

  @override
  List<ModuleDependency> get dependencies => const [
    ModuleDependency(name: 'module_contracts', reason: 'Consumes SessionContract as a read-only identity boundary.'),
    ModuleDependency(name: 'shared_ui', reason: 'Uses reusable enterprise UI primitives.'),
  ];

  @override
  List<MicroAppRoute> get routes => [
    MicroAppRoute(
      path: initialRoute,
      title: 'Profile',
      builder: (_) => ProfileHomePage(session: _session),
    ),
  ];
}

final class ProfileHomePage extends StatelessWidget {
  const ProfileHomePage({required this.session, super.key});

  final SessionContract session;

  @override
  Widget build(BuildContext context) {
    return ModulePage(
      title: 'Profile microapp',
      description: 'The module renders customer profile data from a contract owned by the shell composition root.',
      children: [
        ValueListenableBuilder<SessionUser?>(
          valueListenable: session.currentUser,
          builder: (context, user, _) {
            return ArchitectureCard(
              title: user == null ? 'Guest profile' : user.name,
              subtitle: user == null ? 'Sign in from Auth to see a composed customer context.' : '${user.segment} segment · ${user.role}',
              child: Wrap(
                spacing: 12,
                runSpacing: 12,
                children: const [
                  SizedBox(width: 220, child: MetricTile(label: 'Profile completeness', value: '92%', icon: Icons.fact_check_outlined)),
                  SizedBox(width: 220, child: MetricTile(label: 'Shared contracts', value: '3', icon: Icons.hub_outlined)),
                  SizedBox(width: 220, child: MetricTile(label: 'Module imports', value: '0 auth', icon: Icons.lock_outline)),
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}
