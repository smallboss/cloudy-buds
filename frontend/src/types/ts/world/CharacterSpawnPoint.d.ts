import { ISpawnPoint } from '../interfaces/ISpawnPoint';
import * as THREE from 'three';
import { World } from './World';
import { LoadingManager } from '../core/LoadingManager';
export declare class CharacterSpawnPoint implements ISpawnPoint {
    private object;
    isPlayer: boolean;
    constructor(object: THREE.Object3D, isPlayer?: boolean);
    spawn(loadingManager: LoadingManager, world: World): void;
}
