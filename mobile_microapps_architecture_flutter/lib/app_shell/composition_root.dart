import 'package:auth_module/auth_module.dart';
import 'package:core_network/core_network.dart';
import 'package:insurance_module/insurance_module.dart';
import 'package:module_contracts/module_contracts.dart';
import 'package:payments_module/payments_module.dart';
import 'package:profile_module/profile_module.dart';

import 'app_session_controller.dart';

final class DemoCompositionRoot {
  DemoCompositionRoot()
      : session = AppSessionController(),
        network = const FakeEnterpriseGateway() {
    registry = ModuleRegistry([
      AuthModule(session: session, network: network),
      PaymentsModule(session: session, network: network),
      InsuranceModule(session: session, network: network),
      ProfileModule(session: session),
    ]);
  }

  final AppSessionController session;
  final NetworkClient network;
  late final ModuleRegistry registry;
}
