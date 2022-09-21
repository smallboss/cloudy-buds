import * as THREE from 'three';
import { VehicleSeat } from '../vehicles/VehicleSeat';
import { Character } from './Character.ts';
export declare class VehicleEntryInstance {
    character: Character;
    targetSeat: VehicleSeat;
    entryPoint: THREE.Object3D;
    wantsToDrive: boolean;
    constructor(character: Character);
    update(timeStep: number): void;
}
