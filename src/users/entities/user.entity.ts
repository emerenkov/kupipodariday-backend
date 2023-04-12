import {
    IsEmail,
    IsEmpty,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    Length,
    MaxLength,
    MinLength
} from "class-validator";
import {
    Column,
    Entity,
    OneToMany
} from "typeorm";
import { DefaultEntity } from "../../utils/default.entity";
import { Wish } from "../../wishes/entities/wish.entity";
import { Offer } from "../../offers/entities/offer.entity";
import { Wishlist } from "../../wishlists/entities/wishlist.entity";

@Entity()
export class User extends DefaultEntity {
    @Column({unique: true})
    @IsString()
    @IsNotEmpty()
    @Length(2, 30, { message: 'Минимум 2 символа, максимум 30 символов' })
    username: string;

    @Column({ default: 'Пока тут пусто' })
    @IsString()
    @IsOptional()
    @MaxLength(200, { message: 'Максимум 200 символов' })
    about: string;

    @Column({ default: 'https://i.pravatar.cc/150' })
    @IsUrl()
    @IsOptional()
    avatar: string;

    @Column({ unique: true })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @Column()
    @IsString()
    @MinLength(6, { message: 'Минимум 6 символов' })
    password: string;

    @IsEmpty()
    @OneToMany(() => Wish, (wish) => wish.owner)
    wishes: Array<Wish>;

    @IsEmpty()
    @OneToMany(() => Offer, (offer) => offer.user)
    offers: Array<Offer>;

    @IsEmpty()
    @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
    wishlists: Array<Wishlist>;
}
