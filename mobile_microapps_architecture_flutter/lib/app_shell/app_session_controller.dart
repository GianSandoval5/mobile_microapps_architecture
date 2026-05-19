import 'package:flutter/foundation.dart';
import 'package:module_contracts/module_contracts.dart';

final class AppSessionController implements SessionContract {
  AppSessionController()
      : _currentUser = ValueNotifier<SessionUser?>(
          const SessionUser(
            id: 'customer-1001',
            name: 'Gian Sandoval',
            role: 'Enterprise customer',
            segment: 'Premium',
          ),
        );

  final ValueNotifier<SessionUser?> _currentUser;

  @override
  ValueListenable<SessionUser?> get currentUser => _currentUser;

  @override
  SessionUser? get user => _currentUser.value;

  @override
  bool get isAuthenticated => _currentUser.value != null;

  @override
  Future<void> signInAsDemoUser() async {
    _currentUser.value = const SessionUser(
      id: 'customer-1001',
      name: 'Gian Sandoval',
      role: 'Enterprise customer',
      segment: 'Premium',
    );
  }

  @override
  Future<void> signOut() async {
    _currentUser.value = null;
  }
}
