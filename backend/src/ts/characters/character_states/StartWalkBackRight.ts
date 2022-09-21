import {StartWalkBase} from './_stateLibrary.ts';
import { Character } from '../Character.ts';

export class StartWalkBackRight extends StartWalkBase
{
	constructor(character: Character)
	{
		super(character);
		this.animationLength = character.setAnimation('start_back_right', 0.1);
	}
}
