import { classToPlain, deserialize, serialize } from 'class-transformer';
import { BaseModel } from './base.model';

export class OtpModel extends BaseModel {
  constructor(props: Partial<OtpModel>) {
    super();
    Object.assign(this, props);
  }

  toObject(): Record<string, any> {
    return classToPlain(this);
  }

  fromObject(props: Record<string, any>) {
    Object.assign(this, props);
  }

  serialize(): string {
    return serialize(this);
  }

  deserialize(props: string) {
    Object.assign(this, deserialize(OtpModel, props));
  }
}
