import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_microapps_architecture/app_shell/composition_root.dart';
import 'package:mobile_microapps_architecture/app_shell/microapps_demo_app.dart';

void main() {
  testWidgets('renders the microapps shell and registered modules', (tester) async {
    await tester.pumpWidget(
      MicroappsDemoApp(composition: DemoCompositionRoot()),
    );

    expect(find.text('mobile_microapps_architecture'), findsOneWidget);
    expect(find.text('Auth'), findsWidgets);
    expect(find.text('Payments'), findsWidgets);
    expect(find.text('Insurance'), findsWidgets);
    expect(find.text('Profile'), findsWidgets);
    expect(find.text('Authentication microapp'), findsOneWidget);
  });
}
