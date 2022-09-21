import {StartWalkBase} from './_stateLibrary.ts';
import { Character } from '../Character.ts';

export class StartWalkRight extends StartWalkBase
{
	constructor(character: Character)
	{
		super(character);
		this.animationLength = character.setAnimation('start_right', 0.1);
	}
}
