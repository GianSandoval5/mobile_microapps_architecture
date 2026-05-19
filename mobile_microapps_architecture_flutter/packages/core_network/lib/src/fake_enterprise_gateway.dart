import 'network_client.dart';

final class FakeEnterpriseGateway implements NetworkClient {
  const FakeEnterpriseGateway();

  @override
  Future<NetworkResponse> send(NetworkRequest request) async {
    await Future<void>.delayed(const Duration(milliseconds: 450));

    return switch (request.path) {
      '/auth/session' => const NetworkResponse(
        statusCode: 200,
        data: {
          'sessionId': 'session_demo_001',
          'scope': 'customer:read payments:write insurance:quote',
        },
      ),
      '/payments/transfer' => NetworkResponse(
        statusCode: 201,
        data: {
          'receiptId': 'PAY-${DateTime.now().millisecondsSinceEpoch}',
          'status': 'approved',
          'riskScore': 'low',
        },
      ),
      '/insurance/quote' => const NetworkResponse(
        statusCode: 200,
        data: {
          'quoteId': 'INS-40291',
          'coverage': 'Premium mobile protection',
          'monthlyFee': 18.90,
        },
      ),
      _ => const NetworkResponse(
        statusCode: 404,
        data: {'message': 'Route is not implemented in fake gateway'},
      ),
    };
  }
}
