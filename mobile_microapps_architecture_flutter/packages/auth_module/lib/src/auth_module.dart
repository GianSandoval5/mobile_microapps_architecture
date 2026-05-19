import 'package:core_network/core_network.dart';
import 'package:flutter/material.dart';
import 'package:module_contracts/module_contracts.dart';
import 'package:shared_ui/shared_ui.dart';

final class AuthModule implements MicroAppModule {
  AuthModule({
    required SessionContract session,
    required NetworkClient network,
  })  : _session = session,
        _network = network;

  final SessionContract _session;
  final NetworkClient _network;

  @override
  String get id => 'auth';

  @override
  String get name => 'Auth';

  @override
  String get description => 'Owns demo identity, session state and authentication entry points.';

  @override
  IconData get icon => Icons.verified_user_outlined;

  @override
  String get initialRoute => '/auth';

  @override
  List<ModuleDependency> get dependencies => const [
    ModuleDependency(name: 'module_contracts', reason: 'Reads and mutates SessionContract.'),
    ModuleDependency(name: 'core_network', reason: 'Requests a mocked enterprise session.'),
    ModuleDependency(name: 'shared_ui', reason: 'Uses design system cards and status styles.'),
  ];

  @override
  List<MicroAppRoute> get routes => [
    MicroAppRoute(
      path: initialRoute,
      title: 'Authentication',
      builder: (_) => AuthHomePage(session: _session, network: _network),
    ),
  ];
}

final class AuthHomePage extends StatefulWidget {
  const AuthHomePage({
    required this.session,
    required this.network,
    super.key,
  });

  final SessionContract session;
  final NetworkClient network;

  @override
  State<AuthHomePage> createState() => _AuthHomePageState();
}

final class _AuthHomePageState extends State<AuthHomePage> {
  bool _loading = false;
  String? _sessionScope;

  Future<void> _signIn() async {
    setState(() => _loading = true);
    final response = await widget.network.send(
      const NetworkRequest(method: 'POST', path: '/auth/session'),
    );
    await widget.session.signInAsDemoUser();
    setState(() {
      _loading = false;
      _sessionScope = response.data['scope'] as String?;
    });
  }

  Future<void> _signOut() async {
    setState(() => _loading = true);
    await widget.session.signOut();
    setState(() {
      _loading = false;
      _sessionScope = null;
    });
  }

  @override
  Widget build(BuildContext context) {
    return ModulePage(
      title: 'Authentication microapp',
      description: 'Session logic is exposed through a contract so the shell and other modules do not import auth internals.',
      children: [
        ValueListenableBuilder<SessionUser?>(
          valueListenable: widget.session.currentUser,
          builder: (context, user, _) {
            return ArchitectureCard(
              title: user == null ? 'No active session' : 'Active enterprise session',
              subtitle: user == null ? 'Tap sign in to hydrate the shared session contract.' : '${user.name} · ${user.role}',
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Wrap(
                    spacing: 8,
                    runSpacing: 8,
                    children: [
                      StatusPill(label: user == null ? 'anonymous' : 'authenticated'),
                      if (_sessionScope != null) StatusPill(label: _sessionScope!, color: AppColors.accent),
                    ],
                  ),
                  const SizedBox(height: 16),
                  FilledButton.icon(
                    onPressed: _loading ? null : user == null ? _signIn : _signOut,
                    icon: _loading
                        ? const SizedBox.square(
                            dimension: 16,
                            child: CircularProgressIndicator(strokeWidth: 2),
                          )
                        : Icon(user == null ? Icons.login : Icons.logout),
                    label: Text(user == null ? 'Sign in as demo user' : 'Sign out'),
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}
