import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class DatastoreConfig {
  dbUrl: string;

  dbName: string;

  redisUrl: string;

  @Field()
  retryAttempts?: number;

  @Field()
  retryDelays?: number;
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

  @Field()
  passwordStrength: number;

  @Field()
  onetimeCodeDuration: number;

  @Field()
  onetimeCodeLength: number;
}

@ObjectType()
export class ApiFeaturesConfig {
  @Field()
  enableGraphql: boolean;
}

@ObjectType()
export class AuthFeaturesConfig {
  @Field()
  enableSignup: boolean;

  @Field()
  enableLogin: boolean;

  @Field()
  enableJwt: boolean;

  @Field()
  enableSession: boolean;

  @Field()
  enableAnonymousAuth: boolean;

  @Field()
  loginRequireConfirmation: boolean;

  @Field()
  loginWithSignup: boolean;

  @Field()
  securityLevel: string;
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
}
