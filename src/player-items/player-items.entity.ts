import { Item } from "../items/items.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'player_items' })
export class Player_Item {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ name: 'player_id' })
    player_id!: string

    @Column({ name: 'item_id' })
    item_id!: string
    
    @ManyToOne(() => Item)
    @JoinColumn({ name: 'item_id' })
    item!: Item;
}