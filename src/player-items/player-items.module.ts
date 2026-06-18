import { Module } from '@nestjs/common';
import { PlayerItemsController } from './player-items.controller';
import { PlayerItemsService } from './player-items.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Player_Item } from './player-items.entity';
import { ItemsModule } from 'src/items/items.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Player_Item]),
    ItemsModule
  ],
  controllers: [PlayerItemsController],
  providers: [PlayerItemsService]
})
export class PlayerItemsModule { }
