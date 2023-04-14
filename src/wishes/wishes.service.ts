import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';
import { Wish } from './entities/wish.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class WishesService {
  constructor(
      @InjectRepository(Wish)
      private readonly wishesRepository: Repository<Wish>,
  ) {}

  async createWish(user: User, payload: CreateWishDto): Promise<Wish> {
    return await this.wishesRepository.save({
      ...payload,
      owner: user,
    });
  }

  async findOne(id: number) {
    const wish = await this.wishesRepository.findOne({
      relations: {
        owner: true,
        offers: true,
      },
      where: {
        id,
      },
    });

    return wish;
  }

  async findMany(userId: number) {
    const wishes = await this.wishesRepository.find({
      relations: {
        owner: true,
        offers: true,
      },
      where: {
        owner: {
          id: userId,
        },
      },
    });

    return wishes;
  }

  async findWishById(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      relations: {
        owner: true,
        offers: true,
      },
      where: { id },
    });
    if (!wish) {
      throw new NotFoundException('Не существует');
    }
    delete wish.owner.password;
    return wish;
  }

  async findManyWishes(idsList: number[]): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      where: {
        id: In([...idsList]),
      },
    });

    return wishes;
  }

  async updateWish(id: number, user:User, payload: UpdateWishDto) {
    const wish = await this.wishesRepository.findOne({
      relations: {
        owner: true,
      },
      where: {
        id,
      },
    });
    if (wish.raised > 0) {
      throw new ForbiddenException(
          'Нельзя редактировать подарок, на который уже скидываются',
      );
    }
    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('Нельзя редактировать чужой подарок');
    }
    await this.wishesRepository.update(id, { ...payload });
    return {};
  }

  async raiseAmount(wishId: number, amount: number) {
    return await this.wishesRepository.update({ id: wishId }, { raised: amount });
  }

  async removeWish(id: number, user: User): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      relations: {
        owner: true,
      },
      where: {
        id,
      },
    });
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (wish.owner.id !== user.id) {
      throw new ForbiddenException('Нельзя удалить чужой подарок');
    }
    await this.wishesRepository.delete(id);
    return wish;
  }

  async findTopWishes() {
    return await this.wishesRepository.find({
      relations: {
        owner: true,
        offers: true,
      },
      order: {
        copied: 'DESC',
      },
      take: 20,
    });
  }

  async findLastWishes(): Promise<Wish[]> {
    const wishes = await this.wishesRepository.find({
      relations: {
        owner: true,
        offers: true,
      },
      order: {
        createdAt: 'DESC',
      },
      take: 40,
    });

    return wishes;
  }

  async copyOne(wishId: number, user: User): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: {
        id: wishId,
      },
      relations: {
        owner: true,
      },
    });
    const { id, name, link, image, price, description, copied } = wish;
    if (!wish) {
      throw new NotFoundException('Подарок не найден');
    }
    if (wish.owner.id === user.id) {
      throw new ForbiddenException('Нельзя скопировать свой подарок');
    }

    const similarWishes = await this.hasSomeWishes(
        user,
        name,
        link,
        price,
        description,
    );
    if (similarWishes.length) {
      throw new ForbiddenException('У вас уже есть такой подарок в списке желаний');
    }

    const newCopiesCount = copied + 1;
    await this.wishesRepository.update(id, { copied: newCopiesCount });

    const newWish = await this.wishesRepository.save({
      name,
      link,
      image,
      price,
      description,
      copied: 0,
      owner: user,
    });
    return newWish;
  }

  async hasSomeWishes(
      user: User,
      name: string,
      link: string,
      price: number,
      description: string,
  ): Promise<Wish[]> {
    const wish = await this.wishesRepository.find({
      relations: {
        owner: true,
      },
      where: {
        name,
        link,
        price,
        description,
        owner: {
          id: user.id,
        },
      },
    });

    return wish;
  }
}
