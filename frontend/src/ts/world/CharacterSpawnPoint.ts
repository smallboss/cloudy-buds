import { ISpawnPoint } from '../interfaces/ISpawnPoint';
import * as THREE from 'three';
import { World } from './World';
import { Character } from '../characters/Character';
import { LoadingManager } from '../core/LoadingManager';
import * as Utils from '../core/FunctionLibrary';
import {Object3D} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";
// import path from '../../assets/models/boxman_.glb';

export class CharacterSpawnPoint implements ISpawnPoint
{
	private object: THREE.Object3D;

	constructor(object: THREE.Object3D)
	{
		this.object = object;
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

			let worldPos = new THREE.Vector3();
			this.object.getWorldPosition(worldPos);
			player.setPosition(worldPos.x, worldPos.y, worldPos.z);

			let forward = Utils.getForward(this.object);
			player.setOrientation(forward, true);

			world.add(player);
			player.takeControl();
		});
	}
}


async function loadSomething(filepath: string) {
	return new Promise((resolve) => {
		const loader = new GLTFLoader();

		// @ts-ignore
		loader.load(filepath, model => resolve(model));
	});
}
