import { CreateUserReqDto } from '@/api/users/dto/create-user.req.dto';
import { UsersService } from '@/api/users/users.service';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() reqDto: CreateUserReqDto) {
    return await this.usersService.create(reqDto);
  }
}
