import { CharacterStateBase } from './_stateLibrary.ts';
import { Character } from '../Character.ts';
export declare class Walk extends CharacterStateBase {
    constructor(character: Character);
    update(timeStep: number): void;
    onInputChange(): void;
}
