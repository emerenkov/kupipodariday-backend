import { DefaultEntity } from "../../utils/default.entity";
import {
    Column,
    JoinColumn,
    ManyToOne
} from "typeorm";
import {
    IsInt,
    IsNotEmpty,
    IsOptional,
    IsString,
    IsUrl,
    Length
} from "class-validator";
import { User } from "../../users/entities/user.entity";
import {Offer} from "../../offers/entities/offer.entity";

export class Wish extends DefaultEntity {
    @Column()
    @IsString()
    @IsNotEmpty()
    @Length(1, 250, { message: 'Минимум 1 символ, максимум 250 символов' })
    name: string;

    @Column()
    @IsNotEmpty()
    @IsUrl()
    link: string;

    @Column()
    @IsNotEmpty()
    @IsUrl()
    image: string;

    @Column({ default: 1, scale: 2 })
    @IsNotEmpty()
    price: number;

    @Column({ nullable: true, scale: 2 })
    @IsOptional()
    raised: number;

    @Column()
    @IsString()
    @IsNotEmpty()
    @Length(1, 1024, { message: 'Минимум 1 символ, максимум 1024 символов' })
    description: string;

    @JoinColumn()
    @IsNotEmpty()
    @ManyToOne(() => User, (user) => user.wishes)
    owner: User;

    @ManyToOne(() => Offer, (offer) => offer.item)
    offers: Array<Offer>;

    @Column({ default: 0, nullable: true })
    @IsInt()
    copied: number;
}
