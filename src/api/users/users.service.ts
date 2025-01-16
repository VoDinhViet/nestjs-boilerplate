import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DRIZZLE } from '../../database/database.module';
import { users } from '../../database/schemas';
import { DrizzleDB } from '../../database/types/drizzle';
import { hashPassword } from '../../utils/password.util';
import { CreateUserReqDto } from './dto/create-user.req.dto';

@Injectable()
export class UsersService {
  constructor(@Inject(DRIZZLE) private readonly db: DrizzleDB) {}

  async findOneByEmail(email: string) {
    return this.db.query.users.findFirst({
      where: eq(users.email, email),
    });
  }

  async create(reqDto: CreateUserReqDto) {
    const existingUser = await this.findOneByEmail(reqDto.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    return this.db
      .insert(users)
      .values({
        ...reqDto,
        password: await hashPassword(reqDto.password),
      })
      .returning();
  }
}
