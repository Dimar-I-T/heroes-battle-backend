import { Hero } from "src/heroes/heroes.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'player_heroes' })
export class Player_Hero {
    @PrimaryGeneratedColumn('uuid')
    id!: string

    @Column({ name: 'player_id' })
    player_id!: string

    @Column({ name: 'hero_id' })
    hero_id!: string
    
    @ManyToOne(() => Hero)
    @JoinColumn({ name: 'hero_id' })
    hero!: Hero;
}