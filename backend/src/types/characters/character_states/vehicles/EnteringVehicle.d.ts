import { CharacterStateBase } from '../_stateLibrary.ts';
import { Character } from '../../Character.ts';
import { VehicleSeat } from '../../../vehicles/VehicleSeat';
import { Object3D } from 'three';
export declare class EnteringVehicle extends CharacterStateBase {
    private vehicle;
    private animData;
    private seat;
    private initialPositionOffset;
    private startPosition;
    private endPosition;
    private startRotation;
    private endRotation;
    private factorSimulator;
    constructor(character: Character, seat: VehicleSeat, entryPoint: Object3D);
    update(timeStep: number): void;
    private getEntryAnimations;
}
