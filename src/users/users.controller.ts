import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { WishesService } from '../wishes/wishes.service';
import { JwtGuard } from '../auth/guards/jwt.guard';
import { User } from './entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { UserInterceptor } from '../utils/interceptors/user.interceptors';

@UseInterceptors(UserInterceptor)
@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(
      private readonly usersService: UsersService,
      private readonly wishesService: WishesService,
  ) {}

  @Get('me')
  getMyProfile(@Req() req): Promise<User> {
    return this.usersService.findUserById(req.user.id);
  }

  @Get(':username')
  findUserByUsername(@Param('username') username: string): Promise<User> {
    return this.usersService.findUserByUsername(username);
  }

  @Get('me/wishes')
  findMyWishes(@Req() req): Promise<Wish[]> {
    return this.usersService.findUserWishes(req.user.id);
  }

  @Get(':username/wishes')
  async findWishesByUsername(
      @Param('username') username: string,
  ): Promise<Wish[]> {
    const user = await this.usersService.findUserByUsername(username);
    return this.usersService.findUserWishes(user.id);
  }

  @Post('find')
  findManyUsers(@Body() user) {
    return this.usersService.findMany(user);
  }

  @UseGuards(JwtGuard)
  @Patch('me')
  updateMyProfile(
      @Req() req,
      @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUserById(req.user.id, updateUserDto);
  }
}
