import {DefaultEntity} from "../../utils/default.entity";
import {Column, ManyToOne} from "typeorm";
import {IsBoolean, IsNotEmpty, NotEquals} from "class-validator";
import {User} from "../../users/entities/user.entity";
import {Wish} from "../../wishes/entities/wish.entity";

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
