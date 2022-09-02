import { ISpawnPoint } from '../interfaces/ISpawnPoint';
import * as THREE from 'three';
import { World } from './World';
import { Character } from '../characters/Character';
import { LoadingManager } from '../core/LoadingManager';
import * as Utils from '../core/FunctionLibrary';
import {Object3D} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
import {Walk} from "../characters/character_states/Walk";
import {StartWalkLeft} from "../characters/character_states/StartWalkLeft";
// import path from '../../assets/models/boxman_.glb';

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export class CharacterSpawnPoint implements ISpawnPoint
{
	private object: THREE.Object3D;
	public isPlayer: boolean = false;
	public character: Character;

	constructor(object: THREE.Object3D, isPlayer: boolean = false)
	{
		this.object = object;
		this.isPlayer = isPlayer;
	}

	public spawn(loadingManager: LoadingManager, world: World): void
	{
		// const path = require('../../assets/models/boxman_.glb');
		// console.log('path', path);
		loadingManager.loadGLTF('assets/models/boxman_.glb', async (model) =>
		{
			const modelMan = await loadSomething('assets/models/base_main_rig.glb');
			// @ts-ignore
			model.scene = modelMan.scene;


			let player = new Character(model);
			this.character = player;

			let worldPos = new THREE.Vector3();
			this.object.getWorldPosition(worldPos);
			if (!this.isPlayer) {
				worldPos.copy(worldPos.clone().add(new THREE.Vector3(randomBetween(-5, 5), randomBetween(-5, 5), randomBetween(-5, 5))));
			}
			player.setPosition(worldPos.x, worldPos.y, worldPos.z);

			let forward = Utils.getForward(this.object);
			player.setOrientation(forward, true);

			world.add(player);
			if (this.isPlayer) player.takeControl();
		});
	}

	walk(): void {
		this.character.setState(new StartWalkLeft(this.character));
		this.character.triggerAction('up', true);
	}
}


async function loadSomething(filepath: string) {
	return new Promise((resolve) => {
		const loader = new GLTFLoader();

		// @ts-ignore
		loader.load(filepath, model => resolve(model));
	});
}
