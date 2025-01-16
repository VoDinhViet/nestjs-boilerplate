import { Exclude, Expose } from 'class-transformer';
import { NumberField, StringField } from '../../../decorators/field.decorators';

@Exclude()
export class LoginResDto {
  @Expose()
  @StringField()
  user_id!: string;

  @Expose()
  @StringField()
  access_token!: string;

  @Expose()
  @StringField()
  refresh_token!: string;

  @Expose()
  @NumberField()
  token_expires!: number;
}
