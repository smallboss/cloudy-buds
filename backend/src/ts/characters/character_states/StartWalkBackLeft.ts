import { StartWalkBase } from './_stateLibrary.ts';
import { Character } from '../Character.ts';

export class StartWalkBackLeft extends StartWalkBase
{
	constructor(character: Character)
	{
		super(character);
		this.animationLength = character.setAnimation('start_back_left', 0.1);
	}
}
