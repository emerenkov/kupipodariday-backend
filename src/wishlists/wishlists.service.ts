import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { Wishlist } from './entities/wishlist.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Wish } from '../wishes/entities/wish.entity';
import { WishesService } from 'src/wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
      @InjectRepository(Wishlist)
      private readonly wishlistsRepository: Repository<Wishlist>,
      private readonly wishesService: WishesService,
  ) {}

  async createWishlist(
      user: User,
      createWishlistDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    const { itemsId, ...rest } = createWishlistDto;
    const wishes = itemsId.map((id: number) => ({ id } as Wish));
    const wishlist = this.wishlistsRepository.create({
      ...rest,
      owner: user,
      items: wishes,
    });
    return this.wishlistsRepository.save(wishlist);
  }

  async findAllWishlists(): Promise<Wishlist[]> {
    return this.wishlistsRepository.find({
      relations: ['items', 'owner'],
    });
  }

  async updateWishlist(
      id: number,
      user: User,
      updateWishlistDto: UpdateWishlistDto,
  ): Promise<Wishlist> {
    const { name, description, image, itemsId } = updateWishlistDto;
    const wishlist = await this.findOne(id);
    if (!wishlist) {
      throw new NotFoundException('Список подарков с таким id не найден');
    }
    if (wishlist.owner.id !== user.id) {
      throw new BadRequestException();
    }
    const wishes = await this.wishesService.findManyWishes(itemsId);
    if (wishes.length === 0) {
      throw new NotFoundException('Список подарков с таким id не найден');
    }

    await this.wishlistsRepository.save({
      id,
      name,
      description,
      image,
      owner: user,
      items: [...wishes],
    });
    return await this.findOne(id);
  }

  async findOne(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistsRepository.findOne({
      relations: {
        owner: true,
        items: true,
      },
      where: {
        id,
      },
    });

    if (!wishlist) {
      throw new NotFoundException('Список подарков с таким id не найден');
    }

    return wishlist;
  }

  async removeWishlistById(id: number, userId: number) {
    const wishlist = await this.findOne(id);
    if (wishlist.owner.id !== userId) {
      throw new BadRequestException();
    }

    await this.wishlistsRepository.delete(id);
    return wishlist;
  }
}