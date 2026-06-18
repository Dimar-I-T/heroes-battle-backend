import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'heroes' })
export class Hero {
    @PrimaryGeneratedColumn("uuid")
    hero_id!: string

    @Column()
    name!: string;

    @Column()
    health!: number;

    @Column()
    damage!: number;

    @Column()
    cost!: number;
}