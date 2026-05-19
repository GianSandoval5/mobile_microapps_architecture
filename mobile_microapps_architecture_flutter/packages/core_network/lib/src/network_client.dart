final class NetworkRequest {
  const NetworkRequest({
    required this.method,
    required this.path,
    this.body = const <String, Object?>{},
  });

  final String method;
  final String path;
  final Map<String, Object?> body;
}

final class NetworkResponse {
  const NetworkResponse({
    required this.statusCode,
    required this.data,
  });

  final int statusCode;
  final Map<String, Object?> data;

  bool get isSuccess => statusCode >= 200 && statusCode < 300;
}

abstract interface class NetworkClient {
  Future<NetworkResponse> send(NetworkRequest request);
}
