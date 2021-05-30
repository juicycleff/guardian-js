export class PrivateClaim {
  is_service: boolean;
  sub: string;

  exp?: number;
  aud?: string;
  iat?: number;
  iss?: string;

  jti?: any;
}

export class PublicClaim {
  sub: string;
  email: string;
  username: string;
  mobile: string;

  exp?: number;
  aud?: string;
  iat?: number;
  iss?: string;

  jti?: any;
}
