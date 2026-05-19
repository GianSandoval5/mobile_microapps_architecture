export type NetworkRequest = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: Record<string, unknown>;
};

export type NetworkResponse = {
  statusCode: number;
  data: Record<string, unknown>;
};

export type NetworkClient = {
  send(request: NetworkRequest): Promise<NetworkResponse>;
};

export class FakeEnterpriseGateway implements NetworkClient {
  async send(request: NetworkRequest): Promise<NetworkResponse> {
    await new Promise(resolve => setTimeout(resolve, 450));

    switch (request.path) {
      case '/auth/session':
        return {
          statusCode: 200,
          data: {
            sessionId: 'session_demo_001',
            scope: 'customer:read payments:write insurance:quote',
          },
        };
      case '/payments/transfer':
        return {
          statusCode: 201,
          data: {
            receiptId: `PAY-${Date.now()}`,
            status: 'approved',
            riskScore: 'low',
          },
        };
      case '/insurance/quote':
        return {
          statusCode: 200,
          data: {
            quoteId: 'INS-40291',
            coverage: 'Premium mobile protection',
            monthlyFee: 18.9,
          },
        };
      default:
        return {
          statusCode: 404,
          data: {message: 'Route is not implemented in fake gateway'},
        };
    }
  }
}
