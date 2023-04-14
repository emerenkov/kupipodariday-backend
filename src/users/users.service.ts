import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {Like, Repository} from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hash } from '../utils/hashService';
import {WishesService} from "../wishes/wishes.service";
import {Wish} from "../wishes/entities/wish.entity";

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
      private wishesService: WishesService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const {username, email} = createUserDto
    if (await this.isUser(username, email)) {
      throw new BadRequestException(
          'Пользователь с таким email или username уже зарегистрирован'
      );
    }
    try {
      const hashedPassword = await hash(createUserDto.password);
      const createdUser = this.userRepository.create({
        ...createUserDto,
        password: hashedPassword,
      });
      return await this.userRepository.save(createdUser);
    } catch (err) {
      throw new Error(err.message);
    }
  }

  async findUserById(id: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });
    delete user.password;
    return user;
  }

  async findUserByUsername(username: string): Promise<User> {
    return await this.userRepository.findOneBy({ username });
  }

  async findManyUsers(user): Promise<User[]> {
    const users = await this.userRepository.find({
      where: [{ email: user.query }, { username: user.query }],
    });
    users.forEach((user) => {
      delete user.password;
    });

    return users;
  }

  async findUserWishes(query: number | string): Promise<Wish[]> {
    if (typeof query === 'number') {
      return await this.wishesService.findMany(query);
    }
    if (typeof query === 'string') {
      const user = await this.find({ username: query });
      return await this.wishesService.findMany(user.id);
    }
  }

  async find(
      query: { [K in keyof User]?: User[K] },
      rows: Record<string, boolean> = {},
  ): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        ...query,
      },
      select: {
        ...rows,
      },
    });
    if (!user) {
      throw new NotFoundException('Пользователь с таким имененем не найден');
    }
    return user;
  }

  async findMany(queryText: string) {
    return await this.userRepository.findBy([
      { username: Like(`%${queryText}%`) },
      { email: Like(`%${queryText}%`) },
    ]);
  }

  async updateUserById(id: number, updateUserDto: UpdateUserDto,): Promise<User> {
    const {username, email} = updateUserDto
    if(username || email) {
      if (await this.isUser(username, email)) {
        throw new BadRequestException(
            'Пользователь с таким email или username уже зарегистрирован'
        );
      }
    }
    const data = { ...updateUserDto };
    if (updateUserDto.password) {
      const hash = await bcrypt.hash(updateUserDto.password, 10);
      data.password = hash;
    }

    await this.userRepository.update(id, data);
    return await this.userRepository.findOneBy({ id });
  }

  async isUser(username: string, email: string) {
    const user = await this.userRepository.findOne({
      where: [{ username }, { email }],
    });

    return !!user;
  }
}
