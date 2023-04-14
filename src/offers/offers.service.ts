import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateOfferDto } from './dto/create-offer.dto';
import { User } from 'src/users/entities/user.entity';
import { WishesService } from 'src/wishes/wishes.service';
import { Offer } from './entities/offer.entity';

@Injectable()
export class OffersService {
  constructor(
      @InjectRepository(Offer)
      private readonly offersRepository: Repository<Offer>,
      private readonly wishesService: WishesService,
  ) {}

  async findAllOffers(): Promise<Offer[]> {
    return this.offersRepository.find({ relations: ['item', 'user'] });
  }

  async findOfferById(id: number): Promise<Offer> {
    return this.offersRepository.findOne({
      where: { id },
      relations: ['item', 'user'],
    });
  }

  async createOffer(
      user: User,
      createOfferDto: CreateOfferDto,
  ): Promise<Offer> {
    const { itemId, amount, hidden } = createOfferDto;
    const wish = await this.wishesService.findOne(itemId);

    if (!wish) {
      throw new NotFoundException('Заявка с таким id не найдена');
    }

    const newAmount = wish.raised + amount;

    if (amount < 0) {
      throw new BadRequestException('Cумма должна быть больше 0');
    }
    if (user.id === wish.owner.id) {
      throw new BadRequestException('Не получится скинуться самому себе');
    }
    if (amount > wish.price - wish.raised) {
      throw new BadRequestException(
          'Сумма собранных средств не может превышать стоимость подарка',
      );
    }
    await this.wishesService.raiseAmount(itemId, newAmount)
    const offer = this.offersRepository.create({
      ...createOfferDto,
      user,
      item: wish,
    });

    return await this.offersRepository.save(offer);
  }
}
