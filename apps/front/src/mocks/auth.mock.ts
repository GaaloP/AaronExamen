import {
  API_ERRORS,
  AUTH_ROLES,
  AuthRole,
  LoginRequestDto,
  LoginSuccessResponseDto,
  ApiErrorResponseDto,
} from '../contracts/auth.contract';

const MOCK_USERS: Array<{
  email: string;
  password: string;
  fullName: string;
  uuid: string;
  roleAtIssue: AuthRole;
}> = [
  {
    email: 'agente@ticket.com',
    password: 'agente123',
    fullName: 'Agente de Prueba',
    uuid: 'uuid-agente-001',
    roleAtIssue: AUTH_ROLES.AGENTE,
  },
  {
    email: 'supervisor@test.com',
    password: 'supervisor123',
    fullName: 'Supervisor de Prueba',
    uuid: 'uuid-supervisor-001',
    roleAtIssue: AUTH_ROLES.SUPERVISOR,
  },
];

interface MockTokenPayload {
  sub: string;
  email: string;
  role: AuthRole;
  exp: number;
}

function base64UrlEncode(obj: unknown): string {
  const json = JSON.stringify(obj);
  return typeof window === 'undefined'
    ? Buffer.from(json).toString('base64url')
    : btoa(json);
}

function base64UrlDecode<T>(value: string): T {
  const json =
    typeof window === 'undefined'
      ? Buffer.from(value, 'base64url').toString('utf-8')
      : atob(value);
  return JSON.parse(json) as T;
}

function createMockToken(payload: Omit<MockTokenPayload, 'exp'>, expiresInSeconds: number): string {
  const fullPayload: MockTokenPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };
  const header = base64UrlEncode({ alg: 'mock', typ: 'JWT' });
  const body = base64UrlEncode(fullPayload);
  const fakeSignature = base64UrlEncode({ sig: 'mock-signature' });
  return `${header}.${body}.${fakeSignature}`;
}

export function getRoleByToken(token: string): AuthRole | null {
  try {
    const [, payloadSegment] = token.split('.');
    const payload = base64UrlDecode<MockTokenPayload>(payloadSegment);
    return payload.role;
  } catch {
    return null;
  }
}

export class MockApiError extends Error {
  constructor(public response: ApiErrorResponseDto) {
    super(response.message);
  }
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function mockLogin(dto: LoginRequestDto): Promise<LoginSuccessResponseDto> {
  await delay(600);

  if (!dto.email || !dto.password) {
    throw new MockApiError(API_ERRORS[400]);
  }

  if (dto.email === 'error500@test.com') {
    throw new MockApiError(API_ERRORS[500]);
  }

  const user = MOCK_USERS.find((u) => u.email === dto.email && u.password === dto.password);

  if (!user) {
    throw new MockApiError(API_ERRORS[401]);
  }

  const expiresIn = 3600;
  const accessToken = createMockToken(
    { sub: user.uuid, email: user.email, role: user.roleAtIssue },
    expiresIn
  );

  const decodedRole = getRoleByToken(accessToken);

  return {
    message: 'Login successful',
    data: {
      accessToken,
      expiresIn,
      user: {
        role: decodedRole ?? user.roleAtIssue,
        fullName: user.fullName,
        uuid: user.uuid,
      },
    },
  };
}

console.info(
  '[MOCK] POST /api/v1/auth/login — usuarios de prueba:',
  MOCK_USERS.map((u) => `${u.email} → rol: ${u.roleAtIssue}`)
);