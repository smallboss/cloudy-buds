import { CharacterStateBase } from './_stateLibrary.ts';
import { ICharacterState } from '../../interfaces/ICharacterState.ts';
import { Character } from '../Character.ts';
export declare class JumpRunning extends CharacterStateBase implements ICharacterState {
    private alreadyJumped;
    constructor(character: Character);
    update(timeStep: number): void;
}
