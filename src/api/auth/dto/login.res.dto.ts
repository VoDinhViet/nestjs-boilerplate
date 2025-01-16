import { NumberField, StringField } from '@/decorators/field.decorators';
import { Exclude, Expose } from 'class-transformer';

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
