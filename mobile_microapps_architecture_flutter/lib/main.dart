import 'package:flutter/material.dart';

import 'app_shell/composition_root.dart';
import 'app_shell/microapps_demo_app.dart';

void main() {
  final composition = DemoCompositionRoot();
  runApp(MicroappsDemoApp(composition: composition));
}
