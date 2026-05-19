import 'package:flutter/material.dart';

typedef MicroAppPageBuilder = Widget Function(BuildContext context);

final class MicroAppRoute {
  const MicroAppRoute({
    required this.path,
    required this.title,
    required this.builder,
  });

  final String path;
  final String title;
  final MicroAppPageBuilder builder;
}

final class ModuleDependency {
  const ModuleDependency({
    required this.name,
    required this.reason,
  });

  final String name;
  final String reason;
}

abstract interface class MicroAppModule {
  String get id;
  String get name;
  String get description;
  IconData get icon;
  String get initialRoute;
  List<MicroAppRoute> get routes;
  List<ModuleDependency> get dependencies;
}
