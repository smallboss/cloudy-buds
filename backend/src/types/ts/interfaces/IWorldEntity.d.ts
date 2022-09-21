import { World } from '../world/World.ts';
import { EntityType } from '../enums/EntityType.ts';
import { IUpdatable } from './IUpdatable';
export interface IWorldEntity extends IUpdatable {
    entityType: EntityType;
    addToWorld(world: World): void;
    removeFromWorld(world: World): void;
}
