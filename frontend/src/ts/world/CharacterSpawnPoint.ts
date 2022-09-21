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
import {Scenario} from "./Scenario";
// import path from '../../assets/models/boxman_.glb';

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export class CharacterSpawnPoint implements ISpawnPoint
{
	public object: THREE.Object3D;
	public scenario: Scenario;
	public character: Character;
	public playerId: string;

	constructor(object: THREE.Object3D, scenario?: Scenario, playerId?: string) {
		this.object = object;
		this.scenario = scenario;
		this.playerId = playerId;

		console.log('CharacterSpawnPoint');
	}

	public spawn(loadingManager: LoadingManager, world: World): void
	{
		// const path = require('../../assets/models/boxman_.glb');
		// console.log('path', path);
		loadingManager.loadGLTF('assets/models/boxman_.glb', async (model) =>
		{
			// const animations = model.animations.filter(animation => animation.name !== 'jump_running');
			// model.animations = animations;

			const modelMan = await loadGLFT('assets/models/base_main_rig.glb');
			const newAnimations = await loadFBX('assets/models/jump_far.fbx');
			console.log('model', model);
			console.log('newAnimations', newAnimations);
			// @ts-ignore
			model.scene = modelMan.scene;
			// @ts-ignore
			// newAnimations.animations[0].name = 'jump_running';
			// @ts-ignore
			// model.animations.push(...newAnimations.animations);


			let player = new Character(model, this.scenario);
			this.character = player;

			let worldPos = new THREE.Vector3();
			this.object.getWorldPosition(worldPos);
			if (!this.scenario) {
				worldPos.copy(worldPos.clone().add(new THREE.Vector3(randomBetween(-5, 5), randomBetween(-5, 5), randomBetween(-5, 5))));
			}
			player.setPosition(worldPos.x, worldPos.y, worldPos.z);

			let forward = Utils.getForward(this.object);
			player.setOrientation(forward, true);

			world.add(player);
			if (this.scenario) player.takeControl();
		});
	}
}


async function loadFBX(filepath: string) {
	return new Promise((resolve) => {
		new FBXLoader().load(filepath, model => resolve(model));
	});
}

async function loadGLFT(filepath: string) {
	return new Promise((resolve) => {
		new GLTFLoader().load(filepath, model => resolve(model));
	});
}
