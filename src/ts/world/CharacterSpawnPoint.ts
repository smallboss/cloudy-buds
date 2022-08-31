import { ISpawnPoint } from '../interfaces/ISpawnPoint';
import * as THREE from 'three';
import { World } from './World';
import { Character } from '../characters/Character';
import { LoadingManager } from '../core/LoadingManager';
import * as Utils from '../core/FunctionLibrary';
import {Object3D} from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader";
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";

export class CharacterSpawnPoint implements ISpawnPoint
{
	private object: THREE.Object3D;

	constructor(object: THREE.Object3D)
	{
		this.object = object;
	}

	public spawn(loadingManager: LoadingManager, world: World): void
	{
		loadingManager.loadGLTF('build/assets/boxman_.glb', async (model) =>
		{
			console.log('model', model);
			// model.scene.scale.setScalar(0.005);

			const modelMan = await loadSomething('build/assets/base_main_rig.glb');
			// @ts-ignore
			model.scene = modelMan.scene;

			// model.animations[0].name = 'idle';
			// model.animations[1] = await loadSomething('build/assets/Left Turn.fbx');
			// model.animations[1].name = 'rotate_left';
			// model.animations[2] = await loadSomething('build/assets/Right Turn.fbx');
			// model.animations[2].name = 'rotate_right';


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


async function loadSomething(filepath) {
	return new Promise((resolve) => {
		const loader = new GLTFLoader();

		// @ts-ignore
		loader.load(filepath, model => resolve(model));
	});
}
