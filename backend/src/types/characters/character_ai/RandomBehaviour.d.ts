import { ICharacterAI } from '../../interfaces/ICharacterAI';
import { Character } from '../Character.ts';
export declare class RandomBehaviour implements ICharacterAI {
    character: Character;
    private randomFrequency;
    constructor(randomFrequency?: number);
    update(timeStep: number): void;
}
