import { CharacterStateBase } from '../_stateLibrary.ts';
import { Character } from '../../Character.ts';
import { VehicleSeat } from '../../../vehicles/VehicleSeat';
export declare class SwitchingSeats extends CharacterStateBase {
    private toSeat;
    private startPosition;
    private endPosition;
    private startRotation;
    private endRotation;
    constructor(character: Character, fromSeat: VehicleSeat, toSeat: VehicleSeat);
    update(timeStep: number): void;
}
