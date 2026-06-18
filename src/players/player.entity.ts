import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';

@Entity({ name: 'players' })
export class Player {
    @PrimaryGeneratedColumn("uuid")
    player_id!: string;

    @Column({ unique: true })
    username!: string;

    @Column()
    hashed_password!: string;

    @Column({ default: 0 })
    wins!: number;

    @Column({ default: 0 })
    losses!: number;

    @Column({ default: 100 })
    coins!: number;

    @CreateDateColumn({type: 'timestamp'})
    created_at!: Date;

    @UpdateDateColumn({type: 'timestamp'})
    updated_at!: Date;
}