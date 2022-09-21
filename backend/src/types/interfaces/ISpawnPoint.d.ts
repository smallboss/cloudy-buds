import { World } from '../world/World.ts';
import { LoadingManager } from '../core/LoadingManager';
export interface ISpawnPoint {
    spawn(loadingManager: LoadingManager, world: World): void;
}
