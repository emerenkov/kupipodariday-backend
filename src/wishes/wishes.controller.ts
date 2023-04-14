import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WishesService } from './wishes.service';
import { CreateWishDto } from './dto/create-wish.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { UpdateWishDto } from './dto/update-wish.dto';
import { WishInterceptor } from '../utils/interceptors/wish.interceptors';

@Controller('wishes')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @UseGuards(JwtGuard)
  @Post()
  createWish(@Req() req, @Body() createWishDto: CreateWishDto) {
    return this.wishesService.createWish(req.user, createWishDto);
  }

  @UseInterceptors(WishInterceptor)
  @Get('last')
  findLastWishes() {
    return this.wishesService.findLastWishes();
  }

  @UseInterceptors(WishInterceptor)
  @Get('top')
  findTopWishes() {
    return this.wishesService.findTopWishes();
  }

  @UseInterceptors(WishInterceptor)
  @UseGuards(JwtGuard)
  @Get(':id')
  findWishById(@Param('id') id: number) { //todo
    return  this.wishesService.findWishById(id);
  }

  @UseInterceptors(WishInterceptor)
  @UseGuards(JwtGuard)
  @Patch(':id')
  updateWish(
      @Req() req,
      @Param('id') id: number,
      @Body() updateWishDto: UpdateWishDto,
  ) {
    return this.wishesService.updateWish(id, req.user, updateWishDto);
  }

  @UseInterceptors(WishInterceptor)
  @UseGuards(JwtGuard)
  @Delete(':id')
  deleteWish(
      @Req() req,
      @Param('id') id: number) {
    return this.wishesService.removeWish(id, req.user);
  }

  @UseInterceptors(WishInterceptor)
  @UseGuards(JwtGuard)
  @Post(':id/copy')
  copyWish(@Req() req, @Param('id') id: number) {
    return this.wishesService.copyOne(id, req.user);
  }
}
