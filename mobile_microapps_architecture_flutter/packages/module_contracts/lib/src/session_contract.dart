import 'package:flutter/foundation.dart';

final class SessionUser {
  const SessionUser({
    required this.id,
    required this.name,
    required this.role,
    required this.segment,
  });

  final String id;
  final String name;
  final String role;
  final String segment;
}

abstract interface class SessionContract {
  ValueListenable<SessionUser?> get currentUser;
  SessionUser? get user;
  bool get isAuthenticated;
  Future<void> signInAsDemoUser();
  Future<void> signOut();
}
