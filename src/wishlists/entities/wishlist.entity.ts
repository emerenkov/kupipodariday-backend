import {
    Column,
    Entity,
    JoinTable,
    ManyToMany,
    ManyToOne
} from "typeorm";
import {
    IsNotEmpty,
    IsOptional,
    IsUrl,
    Length,
    MaxLength
} from "class-validator";
import { DefaultEntity } from "../../utils/default.entity";
import { Wish } from "../../wishes/entities/wish.entity";
import { User } from "../../users/entities/user.entity";

@Entity()
export class Wishlist extends DefaultEntity {
    @Column()
    @IsNotEmpty()
    @Length(1, 250, { message: 'Минимум 1 символ, максимум 250 символов' })
    name: string;

    @Column({ nullable: true })
    @IsOptional()
    @MaxLength(1500, { message: 'Максимум 1500 символов' })
    description: string;

    @Column({ default: 'https://i.pravatar.cc/300' })
    @IsOptional()
    @IsUrl()
    image: string;

    @ManyToOne(() => User, (user) => user.wishlists)
    owner: User;

    @JoinTable()
    @IsOptional()
    @ManyToMany(() => Wish)
    items: Array<Wish>;
}
