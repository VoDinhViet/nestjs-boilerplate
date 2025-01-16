import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserReqDto } from './dto/create-user.req.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() reqDto: CreateUserReqDto) {
    return await this.usersService.create(reqDto);
  }
}
