export interface OtpRepositoryContract {
  findByAccountID(id: string): void | Promise<void>;

  findByID(id: string): void | Promise<void>;

  create(username: string): void | Promise<void>;
}
