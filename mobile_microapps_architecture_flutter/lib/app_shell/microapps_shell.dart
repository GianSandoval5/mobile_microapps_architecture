import 'package:flutter/material.dart';
import 'package:module_contracts/module_contracts.dart';
import 'package:shared_ui/shared_ui.dart';

final class MicroappsShell extends StatefulWidget {
  const MicroappsShell({
    required this.registry,
    required this.session,
    super.key,
  });

  final ModuleRegistry registry;
  final SessionContract session;

  @override
  State<MicroappsShell> createState() => _MicroappsShellState();
}

final class _MicroappsShellState extends State<MicroappsShell> {
  late String _selectedRoutePath = widget.registry.initialRoute.path;

  void _selectRoute(String path) {
    setState(() => _selectedRoutePath = path);
  }

  @override
  Widget build(BuildContext context) {
    final route = widget.registry.routeByPath(_selectedRoutePath);
    final selectedModule = widget.registry.moduleForRoute(route.path);

    return LayoutBuilder(
      builder: (context, constraints) {
        final useDesktopLayout = constraints.maxWidth >= 900;

        if (useDesktopLayout) {
          return Scaffold(
            body: SafeArea(
              child: Row(
                children: [
                  _NavigationPanel(
                    registry: widget.registry,
                    selectedModule: selectedModule,
                    onSelectRoute: _selectRoute,
                  ),
                  Expanded(
                    child: Column(
                      children: [
                        _ShellHeader(
                          registry: widget.registry,
                          selectedModule: selectedModule,
                          session: widget.session,
                        ),
                        Expanded(child: route.builder(context)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          );
        }

        return Scaffold(
          appBar: AppBar(title: const Text('Mobile Microapps')),
          drawer: Drawer(
            child: SafeArea(
              child: _NavigationPanel(
                registry: widget.registry,
                selectedModule: selectedModule,
                onSelectRoute: (path) {
                  Navigator.of(context).pop();
                  _selectRoute(path);
                },
              ),
            ),
          ),
          body: Column(
            children: [
              _ShellHeader(
                registry: widget.registry,
                selectedModule: selectedModule,
                session: widget.session,
              ),
              Expanded(child: route.builder(context)),
            ],
          ),
          bottomNavigationBar: NavigationBar(
            selectedIndex: widget.registry.modules.indexOf(selectedModule),
            onDestinationSelected: (index) => _selectRoute(widget.registry.modules[index].initialRoute),
            destinations: [
              for (final module in widget.registry.modules)
                NavigationDestination(
                  icon: Icon(module.icon),
                  label: module.name,
                ),
            ],
          ),
        );
      },
    );
  }
}

final class _NavigationPanel extends StatelessWidget {
  const _NavigationPanel({
    required this.registry,
    required this.selectedModule,
    required this.onSelectRoute,
  });

  final ModuleRegistry registry;
  final MicroAppModule selectedModule;
  final ValueChanged<String> onSelectRoute;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: 300,
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(right: BorderSide(color: AppColors.border)),
      ),
      child: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text(
            'mobile_microapps_architecture',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w900),
          ),
          const SizedBox(height: 6),
          Text(
            'Flutter enterprise reference',
            style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.mutedInk),
          ),
          const SizedBox(height: 24),
          for (final module in registry.modules)
            _ModuleNavTile(
              module: module,
              selected: module.id == selectedModule.id,
              onTap: () => onSelectRoute(module.initialRoute),
            ),
          const SizedBox(height: 24),
          const ArchitectureCard(
            title: 'Shared packages',
            subtitle: 'Contracts, network and UI are imported as package boundaries.',
            child: Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                StatusPill(label: 'module_contracts'),
                StatusPill(label: 'core_network', color: AppColors.accent),
                StatusPill(label: 'shared_ui', color: AppColors.success),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

final class _ModuleNavTile extends StatelessWidget {
  const _ModuleNavTile({
    required this.module,
    required this.selected,
    required this.onTap,
  });

  final MicroAppModule module;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Material(
        color: selected ? AppColors.brand.withValues(alpha: 0.1) : Colors.transparent,
        borderRadius: BorderRadius.circular(8),
        child: ListTile(
          selected: selected,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          leading: Icon(module.icon, color: selected ? AppColors.brand : AppColors.mutedInk),
          title: Text(module.name, style: const TextStyle(fontWeight: FontWeight.w800)),
          subtitle: Text(module.description, maxLines: 2, overflow: TextOverflow.ellipsis),
          onTap: onTap,
        ),
      ),
    );
  }
}

final class _ShellHeader extends StatelessWidget {
  const _ShellHeader({
    required this.registry,
    required this.selectedModule,
    required this.session,
  });

  final ModuleRegistry registry;
  final MicroAppModule selectedModule;
  final SessionContract session;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(24, 18, 24, 18),
      decoration: const BoxDecoration(
        color: AppColors.surface,
        border: Border(bottom: BorderSide(color: AppColors.border)),
      ),
      child: Wrap(
        spacing: 16,
        runSpacing: 12,
        crossAxisAlignment: WrapCrossAlignment.center,
        children: [
          SizedBox(
            width: 280,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  selectedModule.name,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w900),
                ),
                Text(
                  'Mounted by shell through MicroAppModule contract',
                  style: Theme.of(context).textTheme.bodySmall?.copyWith(color: AppColors.mutedInk),
                ),
              ],
            ),
          ),
          SizedBox(
            width: 160,
            child: MetricTile(label: 'Microapps', value: '${registry.modules.length}', icon: Icons.apps_outlined),
          ),
          SizedBox(
            width: 160,
            child: MetricTile(label: 'Routes', value: '${registry.routes.length}', icon: Icons.route_outlined),
          ),
          ValueListenableBuilder<SessionUser?>(
            valueListenable: session.currentUser,
            builder: (context, user, _) {
              return SizedBox(
                width: 220,
                child: MetricTile(
                  label: 'Session contract',
                  value: user == null ? 'Guest' : user.segment,
                  icon: Icons.verified_outlined,
                ),
              );
            },
          ),
        ],
      ),
    );
  }
}
