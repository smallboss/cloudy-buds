import {StartWalkBase} from './_stateLibrary.ts';
import { Character } from '../Character.ts';

export class StartWalkForward extends StartWalkBase
{
	constructor(character: Character)
	{
		super(character);
		this.animationLength = character.setAnimation('start_forward', 0.1);
	}
}
