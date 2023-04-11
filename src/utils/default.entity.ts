import { IsDate } from "class-validator";
import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from "typeorm";

@Entity()
export abstract class DefaultEntity {
    @PrimaryGeneratedColumn()
    id: number

    @CreateDateColumn()
    @IsDate()
    createdAT: Date;

    @UpdateDateColumn()
    @IsDate()
    updatedAt: Date;
}