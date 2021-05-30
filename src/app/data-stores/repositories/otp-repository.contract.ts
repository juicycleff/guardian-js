export interface AccountRepositoryContract {

  findByUsername(username: string): void | Promise<void>

  findByEmail(email: string): void | Promise<void>

  findById(id: string): void | Promise<void>

  findByIdentity(id: string): void | Promise<void>

  findByMobile(digit: string, prefix: string): void | Promise<void>

  create(username: string): void | Promise<void>
}
