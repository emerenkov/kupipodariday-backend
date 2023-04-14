import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { Wishlist } from './entities/wishlist.entity';
import { User } from '../users/entities/user.entity';
import { WishInterceptor } from '../utils/interceptors/wish.interceptors';

@UseInterceptors(WishInterceptor)
@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private readonly wishlistsService: WishlistsService) {}

  @Get()
  async findAllWishlists(): Promise<Wishlist[]> {
    return this.wishlistsService.findAllWishlists();
  }

  @Post()
  createWishlist(
      @Req() req,
      @Body() createWishlistDto: CreateWishlistDto,
  ) {
    return this.wishlistsService.createWishlist(req.user, createWishlistDto);
  }

  @Get(':id')
  findWishlistById(@Param('id') id: number) {
    return this.wishlistsService.findOne(id);
  }

  @Patch(':id')
  updateWishlistById(
      @Req() req,
      @Param('id') id: number,
      @Body() updateWishlistDto: UpdateWishlistDto,
  ) {
    return this.wishlistsService.updateWishlist(id, req.user, updateWishlistDto);
  }

  @Delete(':id')
  removeWishlistById(
      @Req() { user }: { user: User },
      @Param('id') id: number,
  ): Promise<Wishlist> {
    return this.wishlistsService.removeWishlistById(id, user.id);
  }
}
