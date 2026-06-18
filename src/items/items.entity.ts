import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: 'items'})
export class Item {
    @PrimaryGeneratedColumn('uuid')
    item_id!: string;

    @Column()
    name!: string;

    @Column()
    plus_health!: number;

    @Column()
    plus_damage!: number;

    @Column()
    cost!: number;
}
