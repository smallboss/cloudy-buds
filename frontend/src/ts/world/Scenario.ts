import { ISpawnPoint } from '../interfaces/ISpawnPoint';
import { CharacterSpawnPoint } from './CharacterSpawnPoint';
import { World } from '../world/World';
import { LoadingManager } from '../core/LoadingManager';
import * as THREE from 'three';

export class Scenario
{
	public id: string;
	public name: string;
	public spawnAlways: boolean = false;
	public default: boolean = false;
	public world: World;
	public descriptionTitle: string;
	public descriptionContent: string;

	private rootNode: THREE.Object3D;
	private spawnPoints: ISpawnPoint[] = [];
	private invisible: boolean = false;
	private initialCameraAngle: number;
	public localPlayer: CharacterSpawnPoint;

	public characterSpawnPointList: CharacterSpawnPoint[] = [];
	public remoteData: any = [];

	constructor(root: THREE.Object3D, world: World)
	{
		this.rootNode = root;
		this.world = world;
		this.id = root.name;

		// characterSpawnPointList

		// Scenario
		if (root.userData.hasOwnProperty('name'))
		{
			this.name = root.userData.name;
		}
		if (root.userData.hasOwnProperty('default') && root.userData.default === 'true')
		{
			this.default = true;
		}
		if (root.userData.hasOwnProperty('spawn_always') && root.userData.spawn_always === 'true')
		{
			this.spawnAlways = true;
		}
		if (root.userData.hasOwnProperty('invisible') && root.userData.invisible === 'true')
		{
			this.invisible = true;
		}
		if (root.userData.hasOwnProperty('desc_title'))
		{
			this.descriptionTitle = root.userData.desc_title;
		}
		if (root.userData.hasOwnProperty('desc_content'))
		{
			this.descriptionContent = root.userData.desc_content;
		}
		if (root.userData.hasOwnProperty('camera_angle'))
		{
			this.initialCameraAngle = root.userData.camera_angle;
		}

		if (!this.invisible) this.createLaunchLink();

		// Find all scenario spawns and enitites
		root.traverse((child) => {
			if (child.hasOwnProperty('userData') && child.userData.hasOwnProperty('data'))
			{
				if (child.userData.data === 'spawn')
				{
					if (child.userData.type === 'player')
					{
						this.localPlayer = new CharacterSpawnPoint(child, this);
						this.spawnPoints.push(this.localPlayer);

						// [...new Array(3)].forEach(el => {
						// 	const characterSpawn = new CharacterSpawnPoint(child);
						// 	console.log('characterSpawn', characterSpawn);
						// 	this.spawnPoints.push(characterSpawn);
						// });
					}
				}
			}
		});

		this.updateRemotePlayers();
	}

	updateRemotePlayers() {
		requestAnimationFrame(() => this.updateRemotePlayers());

		const remotePlayers: CharacterSpawnPoint[] = [];

		// console.log('this.remoteData', this.remoteData);
		// console.log('this.characterSpawnPointList', this.characterSpawnPointList);

		this.remoteData.forEach((data: any) => {
			if (data.id === this.localPlayer.character.playerId) return;

			const rplayerSpawn = this.characterSpawnPointList.find(({playerId}) => playerId === data.id);
			if (rplayerSpawn === undefined) {
				const newPlayer = new CharacterSpawnPoint(this.localPlayer.object, undefined, data.id);
				newPlayer.spawn(new LoadingManager(), this.world);
				remotePlayers.push(newPlayer);
			}
			else {
				remotePlayers.push(rplayerSpawn);
			}
		});

		this.characterSpawnPointList = [...remotePlayers];
	}

	public createLaunchLink(): void
	{
		this.world.params[this.name] = () =>
		{
			this.world.launchScenario(this.id);
		};
		this.world.scenarioGUIFolder.add(this.world.params, this.name);
	}

	public launch(loadingManager: LoadingManager, world: World): void
	{
		this.spawnPoints.forEach((sp) => {
			sp.spawn(loadingManager, world);
		});

		if (!this.spawnAlways)
		{
			loadingManager.createWelcomeScreenCallback(this);

			world.cameraOperator.theta = this.initialCameraAngle;
			world.cameraOperator.phi = 15;
		}
	}
}
