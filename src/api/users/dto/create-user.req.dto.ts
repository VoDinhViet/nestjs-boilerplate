import {
  EmailField,
  PasswordField,
  StringField,
} from '../../../decorators/field.decorators';

export class CreateUserReqDto {
  @EmailField()
  email: string;

  @PasswordField()
  password: string;

  @StringField()
  full_name: string;
}
