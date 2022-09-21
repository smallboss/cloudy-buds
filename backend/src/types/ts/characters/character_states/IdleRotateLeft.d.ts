import { CharacterStateBase } from './_stateLibrary.ts';
import { ICharacterState } from '../../interfaces/ICharacterState.ts';
import { Character } from '../Character.ts';
export declare class IdleRotateLeft extends CharacterStateBase implements ICharacterState {
    constructor(character: Character);
    update(timeStep: number): void;
    onInputChange(): void;
}
