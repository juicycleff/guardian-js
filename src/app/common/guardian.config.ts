import { Field, ObjectType } from '@nestjs/graphql';
import { IGuardianSchema } from './schema';

@ObjectType()
export class DatastoreConfig {
  databaseName: string;

  databaseUrl: string;

  redisUrl: string;

  @Field()
  retryAttempts?: number;

  @Field()
  retryDelays?: number;
}

@ObjectType()
export class OtpSecurityConfig {
  @Field()
  duration: number;
  @Field()
  length: number;
}

@ObjectType()
export class SecurityConfig {
  authSalt: string;
  jwtExpiration: number;
  jwtKey: string;
  jwtIssuer: string;
  sessionKey: string;

  @Field()
  sessionName: string;

  @Field()
  sessionSecure: boolean;

  @Field()
  sessionMaxAgeSecs: number;

  @Field()
  sessionPath: string;

  @Field(() => OtpSecurityConfig)
  otp: OtpSecurityConfig;
}

@ObjectType()
export class ApiFeaturesConfig {
  @Field()
  enableGraphql: boolean;
}

@ObjectType()
export class AuthFeaturesConfig {
  @Field()
  enabled: boolean;

  @Field()
  enableJwt: boolean;

  @Field()
  enableSession: boolean;

  @Field()
  enableAnonymousAuth: boolean;

  @Field()
  loginRequireConfirmation: boolean;

  @Field()
  securityLevel: string;
}

@ObjectType()
export class SignupFeaturesConfig {
  @Field()
  enabled: boolean;

  @Field()
  enableVerification: boolean;

  @Field()
  loginWithSignup: boolean;
}

export class LoggingConfig {
  sentry: SentryLoggingConfig;
}

@ObjectType()
export class FeaturesConfig {
  @Field(() => ApiFeaturesConfig)
  api: ApiFeaturesConfig;

  @Field(() => AuthFeaturesConfig)
  auth: AuthFeaturesConfig;

  @Field(() => SignupFeaturesConfig)
  signup: SignupFeaturesConfig;

  @Field()
  enableSoftDelete: boolean;
}

export class SentryLoggingConfig {
  dsn: string;
  environment: string;
}

export class IntegrationConfig {
  sendgrid: SendgridIntegrationConfig;
}

export class SendgridIntegrationConfig {
  apiKey: string;
}

export class FilesConfig {
  securityCert: string;
  securityKey: string;
}

@ObjectType()
export class UsernameFieldsPolicyConfig {
  @Field()
  enabled: boolean;

  @Field()
  mutable: boolean;
}

@ObjectType()
export class EmailFieldsPolicyConfig {
  @Field()
  enabled: boolean;

  @Field()
  requireConfirmation: boolean;

  @Field()
  mutable: boolean;
}

@ObjectType()
export class PhoneNumberFieldsPolicyConfig {
  @Field()
  enabled: boolean;

  @Field()
  mutable: boolean;

  @Field()
  requireConfirmation: boolean;
}

@ObjectType()
export class PasswordPolicyConfig {
  @Field()
  minimumLength: number;

  @Field()
  requireLowercase: boolean;

  @Field()
  requireNumbers: boolean;

  @Field()
  requireUppercase: boolean;

  @Field()
  requireSymbols: boolean;

  @Field()
  strength: number;

  @Field()
  authName: string;
}

@ObjectType()
export class FieldsPolicyConfig {
  @Field(() => UsernameFieldsPolicyConfig)
  username: UsernameFieldsPolicyConfig;

  @Field(() => EmailFieldsPolicyConfig)
  email: EmailFieldsPolicyConfig;

  @Field(() => PhoneNumberFieldsPolicyConfig)
  phoneNumber: PhoneNumberFieldsPolicyConfig;
}

@ObjectType()
export class GuardianConfig {
  @Field(() => DatastoreConfig)
  datastore: DatastoreConfig;

  @Field(() => SecurityConfig)
  security: SecurityConfig;

  @Field(() => FeaturesConfig)
  features: FeaturesConfig;

  logging: LoggingConfig;

  integration: IntegrationConfig;

  files: FilesConfig;

  @Field(() => FieldsPolicyConfig)
  fieldsPolicy: FieldsPolicyConfig;

  @Field(() => PasswordPolicyConfig)
  passwordPolicy: PasswordPolicyConfig;

  @Field(() => IGuardianSchema)
  schemas?: IGuardianSchema;
}
