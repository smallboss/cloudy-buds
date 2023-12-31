import { Character } from '../characters/Character.ts';
import { IInputReceiver } from './IInputReceiver';
import { EntityType } from '../enums/EntityType.ts';
export interface IControllable extends IInputReceiver {
    entityType: EntityType;
    position: THREE.Vector3;
    controllingCharacter: Character;
    triggerAction(actionName: string, value: boolean): void;
    resetControls(): void;
    allowSleep(value: boolean): void;
    onInputChange(): void;
    noDirectionPressed(): boolean;
}
