import { ISpawnPoint } from '../interfaces/ISpawnPoint';
import * as THREE from 'three';
import { World } from './World.ts';
import { Character } from '../characters/Character.ts';
import { LoadingManager } from '../core/LoadingManager.ts';
import * as Utils from '../core/FunctionLibrary.ts';
// import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {StartWalkLeft} from "../characters/character_states/StartWalkLeft.ts";
import {Scenario} from "./Scenario.ts";
import path from "path";
import {default as AMMONodejs} from '@enable3d/ammo-on-nodejs';

const randomBetween = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export class CharacterSpawnPoint implements ISpawnPoint
{
	public object: THREE.Object3D;
	public scenario: Scenario;
	public character: Character;
	public playerId: string;

	constructor(object: THREE.Object3D, scenario?: Scenario, playerId?: string)
	{
		this.object = object;
		this.scenario = scenario;
		this.playerId = playerId;
	}

	public spawn(loadingManager: LoadingManager, world: World): void
	{
		// const path = require('../../assets/models/boxman_.glb');
		// console.log('path', path);
		// new AMMONodejs.Loaders.GLTFLoader().load(path.resolve(process.cwd(), './src/assets/models/boxman_.glb'))
		// 	.then(async (model) => {
		// 		const modelMan = await loadSomething(path.resolve(process.cwd(), './src/assets/models/base_main_rig.glb'));
		// 		// @ts-ignore
		// 		model.scene = modelMan.scene;


				let player = new Character(new THREE.Object3D(), this.scenario);
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
				// if (this.scenario) player.takeControl();
			// })
	}
}


async function loadSomething(filepath: string) {
	return new Promise((resolve) => {
		const loader = new AMMONodejs.Loaders.GLTFLoader();

		// @ts-ignore
		loader.load(filepath).then(model => resolve(model));
	});
}
