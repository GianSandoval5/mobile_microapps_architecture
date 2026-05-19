import 'micro_app_module.dart';

final class ModuleRegistry {
  ModuleRegistry(List<MicroAppModule> modules) : _modules = List.unmodifiable(modules);

  final List<MicroAppModule> _modules;

  List<MicroAppModule> get modules => _modules;

  MicroAppRoute get initialRoute => _modules.first.routes.first;

  Iterable<MicroAppRoute> get routes => _modules.expand((module) => module.routes);

  MicroAppModule moduleForRoute(String path) {
    return _modules.firstWhere(
      (module) => module.routes.any((route) => route.path == path),
    );
  }

  MicroAppRoute routeByPath(String path) {
    return routes.firstWhere(
      (route) => route.path == path,
      orElse: () => initialRoute,
    );
  }
}
