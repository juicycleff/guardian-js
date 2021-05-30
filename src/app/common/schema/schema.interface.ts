export interface IGuardianSchema {
  dataType?: 'String' | 'Number';
  developmentOnly?: boolean;
  mutable?: boolean;
  name: string;
  required?: boolean;
}
