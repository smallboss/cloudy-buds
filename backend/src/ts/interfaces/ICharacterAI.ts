import { Character } from '../characters/Character.ts';

export interface ICharacterAI {
	character: Character;
	update(timeStep: number): void;
}
