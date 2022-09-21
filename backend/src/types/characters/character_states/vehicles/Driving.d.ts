import { CharacterStateBase } from '../_stateLibrary.ts';
import { Character } from '../../Character.ts';
import { VehicleSeat } from 'src/ts/vehicles/VehicleSeat';
export declare class Driving extends CharacterStateBase {
    private seat;
    constructor(character: Character, seat: VehicleSeat);
    update(timeStep: number): void;
}
