export abstract class BaseModel {
  id: string;

  createdBy?: string;

  createdAt: Date;

  updatedBy?: string;

  updatedAt: Date;

  deletedAt?: Date;
}
