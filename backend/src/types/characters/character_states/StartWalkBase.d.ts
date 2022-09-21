import { CharacterStateBase } from './_stateLibrary.ts';
import { Character } from '../Character.ts';
export declare class StartWalkBase extends CharacterStateBase {
    constructor(character: Character);
    update(timeStep: number): void;
    onInputChange(): void;
}
