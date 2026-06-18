import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import type { resultMatchType } from "./types";
import { Hero } from "src/heroes/heroes.entity";

@Entity({ name: 'matches' })
export class Match {
    @PrimaryGeneratedColumn('uuid')
    match_id!: string

    @Column({ name: 'player_id' })
    player_id!: string

    @Column({ name: 'hero_id' })
    hero_id!: string

    @ManyToOne(() => Hero)
    @JoinColumn({ name: 'hero_id' })
    hero!: Hero;

    @Column({ name: 'enemy_id' })
    enemy_id!: string

    @ManyToOne(() => Hero)
    @JoinColumn({ name: 'enemy_id' })
    enemy!: Hero;

    @Column({ type: 'varchar', default: 'unfinished' })
    result_match!: string

    @CreateDateColumn({type: 'timestamp'})
    created_at!: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updated_at!: Date;
}