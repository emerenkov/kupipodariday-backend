import {
    Column,
    Entity,
    ManyToOne
} from "typeorm";
import {
    IsBoolean,
    IsNotEmpty,
    NotEquals
} from "class-validator";
import { DefaultEntity } from "../../utils/default.entity";
import { User } from "../../users/entities/user.entity";
import { Wish } from "../../wishes/entities/wish.entity";

@Entity()
export class Offer extends DefaultEntity {

    @Column({
        default: 0,
        scale: 2,
    })
    @IsNotEmpty()
    @NotEquals(0)
    amount: number;

    @Column({ default: false })
    @IsBoolean()
    hidden: boolean;

    @ManyToOne(() => User, (user) => user.offers)
    user: User;

    @ManyToOne(() => Wish, (wish) => wish.offers)
    @IsNotEmpty()
    item: Wish;
}
