import 'package:flutter/material.dart';
import 'package:shared_ui/shared_ui.dart';

import 'composition_root.dart';
import 'microapps_shell.dart';

final class MicroappsDemoApp extends StatelessWidget {
  const MicroappsDemoApp({
    required this.composition,
    super.key,
  });

  final DemoCompositionRoot composition;

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Mobile Microapps Architecture',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      home: MicroappsShell(
        registry: composition.registry,
        session: composition.session,
      ),
    );
  }
}
