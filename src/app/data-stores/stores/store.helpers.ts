export interface DatabaseTablesOptions {
  [name: string]: DatabaseInnerTableOptions;
}

export interface DatabaseInnerTableOptions {
  name: string;
  indexes?: {
    [name: string]: {
      name: string;
      unique?: boolean;
      sparse?: boolean;
      partialFilterExpression?: any;
      expireAfterSeconds?: any;
      min?: any;
      max?: any;
    };
  };
}

export const DatabaseTables: DatabaseTablesOptions = {
  accounts: {
    name: 'accounts',
    indexes: {
      username: {
        name: 'username_1',
        unique: true,
        sparse: true,
      },
      email: {
        name: 'email_1',
        unique: true,
        sparse: true,
      },
      phoneNumber: {
        name: 'phoneNumber_1',
        unique: true,
        sparse: true,
      },
    },
  },
  otp: {
    name: 'one_time_code',
  },
  oauthAccount: {
    name: 'oauth_account',
  },
};
