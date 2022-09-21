import { CharacterStateBase } from './_stateLibrary.ts';
import { Character } from '../Character.ts';
export declare class Sprint extends CharacterStateBase {
    constructor(character: Character);
    update(timeStep: number): void;
    onInputChange(): void;
}
