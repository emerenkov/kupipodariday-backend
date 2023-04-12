import { Module } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';
import { Wishlist } from "./entities/wishlist.entity";
import { Wish } from "../wishes/entities/wish.entity";
import { User } from "../users/entities/user.entity";
import { UsersModule } from "../users/users.module";
import { WishesModule } from "../wishes/wishes.module";

@Module({
  imports: [TypeOrmModule.forFeature([Wishlist, Wish, User]),
    WishesModule,
    UsersModule,
  ],
  controllers: [WishlistsController],
  providers: [WishlistsService]
})
export class WishlistsModule {}
