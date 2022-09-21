import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import * as Utils from '../core/FunctionLibrary.ts';

import _ammo  from '@enable3d/ammo-on-nodejs/ammo/ammo.js';
import {default as AMMONodejs} from '@enable3d/ammo-on-nodejs';

import {BoxCollider} from "../physics/colliders/BoxCollider.ts";
import {HammerCollider} from "../physics/colliders/HammerCollider.ts";
import {InputManager} from "../core/InputManager.ts";
import {CameraOperator} from "../core/CameraOperator.ts";
import {InfoStack} from "../core/InfoStack.ts";
import {Scenario} from "./Scenario.ts";
import {Character} from "../characters/Character.ts";
import {Path} from "./Path.ts";
import {IUpdatable} from "../interfaces/IUpdatable.ts";
import {KettlebellCollider} from "../physics/colliders/KettlebellCollider.ts";
import {LoadingManager} from "../core/LoadingManager.ts";
import {IWorldEntity} from "../interfaces/IWorldEntity";
import {CharacterSpawnPoint} from "./CharacterSpawnPoint.ts";
// import ServerScene from "../../ServerScene.ts";



class World
{
	// public renderer: THREE.WebGLRenderer;
	// public camera: THREE.PerspectiveCamera;
	public graphicsWorld: THREE.Scene;
	public physicsWorld: CANNON.World;
	public parallelPairs: any[];
	public physicsFrameRate: number;
	public physicsFrameTime: number;
	public physicsMaxPrediction: number;
	public clock: THREE.Clock;
	public renderDelta: number;
	public logicDelta: number;
	public requestDelta: number;
	public sinceLastFrame: number;
	public justRendered: boolean;
	public params: any;
	public inputManager: InputManager;
	public cameraOperator: CameraOperator;
	public timeScaleTarget: number = 1;
	public console: InfoStack;
	// public cannonDebugRenderer: CannonDebugRenderer;
	public scenarios: Scenario[] = [];
	public characters: Character[] = [];
	// public vehicles: Vehicle[] = [];
	public paths: Path[] = [];
	//public scenarioGUIFolder: any;
	public updatables: IUpdatable[] = [];
	public wheel: CANNON.HingeConstraint;
	public hammers: HammerCollider[] = [];
	public kettlebells: KettlebellCollider[] = [];
	public boxes: BoxCollider[] = [];

	private lastScenarioID: string;

	constructor(worldScenePath?: any)
	{
		const scope = this;

		// test if we have access to Ammo
		console.log('Ammo', new Ammo.btVector3(1, 2, 3).y() === 2);

		this.graphicsWorld = new THREE.Scene();

		// Physics
 		this.physicsWorld = new CANNON.World();
 		this.physicsWorld.gravity.set(0, -9.81, 0);
 		this.physicsWorld.broadphase = new CANNON.SAPBroadphase(this.physicsWorld);
 		this.physicsWorld.solver.iterations = 10;
 		this.physicsWorld.allowSleep = true;

 		this.parallelPairs = [];
 		this.physicsFrameRate = 60;
 		this.physicsFrameTime = 1 / this.physicsFrameRate;
 		this.physicsMaxPrediction = this.physicsFrameRate;

 		// RenderLoop
 		this.clock = new THREE.Clock();
 		this.renderDelta = 0;
 		this.logicDelta = 0;
 		this.sinceLastFrame = 0;
 		this.justRendered = false;

		this.params = {
			Pointer_Lock: true,
			Mouse_Sensitivity: 0.3,
			Time_Scale: 1,
			Shadows: false,
			Debug_Physics: false,
			Sun_Elevation: 50,
			Sun_Rotation: 145,
		};

 		// Create right panel GUI
 		// this.createParamsGUI(scope);

 		// Initialization
 		// this.inputManager = new InputManager(this, this.renderer.domElement);
 		// this.cameraOperator = new CameraOperator(this, this.camera, this.params.Mouse_Sensitivity);
 		// this.sky = new Sky(this);

 		//disable shadows by default
 		// this.sky.csm.lights.forEach((light) => {
 		// 	light.castShadow = false;
 		// });

 		// Load scene if path is supplied
 		if (worldScenePath !== undefined)
 		{
 			let loadingManager = new LoadingManager(this);
 			loadingManager.onFinishedCallback = () =>
 			{
 				this.update(1, 1);
 				this.setTimeScale(1);
 				// UIManager.setUserInterfaceVisible(true);
 			};
 			loadingManager.loadGLTF(worldScenePath, (gltf) => {
 				this.loadScene(loadingManager, gltf);
 			});
 		}

		const clock = new AMMONodejs.ServerClock();
		// for debugging you disable high accuracy
		// high accuracy uses much more cpu power
		// if (process.env.NODE_ENV !== 'production') clock.disableHighAccuracy()
		// clock.disableHighAccuracy();
		clock.onTick(delta => this.render(this));
 		// this.render(this);
	}

 	// Update
 	// Handles all logic updates.
 	public update(timeStep: number, unscaledTimeStep: number): void
 	{
 		this.updatePhysics(timeStep);

 		// Update registred objects
 		this.updatables.forEach((entity) => {
 			entity.update(timeStep, unscaledTimeStep);
 		});

 		// Lerp time scale
 		this.params.Time_Scale = THREE.MathUtils.lerp(this.params.Time_Scale, this.timeScaleTarget, 0.2);
 	}

 	public updatePhysics(timeStep: number): void
 	{
 		// Step the physics world
 		this.physicsWorld.step(this.physicsFrameTime, timeStep);

 		this.characters.forEach((char) => {
 			if (this.isOutOfBounds(char.characterCapsule.body.position))
 			{
 				this.outOfBoundsRespawn(char.characterCapsule.body);
 			}
 		});

 		this.hammers.forEach(el => {
 			el.update()
 		})

 		this.kettlebells.forEach(el => {
 			el.update()
 		})

 		this.boxes.forEach(el => {
 			el.update()
 		})
 	}

 	public isOutOfBounds(position: CANNON.Vec3): boolean
 	{
 		let inside = position.x > -211.882 && position.x < 211.882 &&
 					position.z > -169.098 && position.z < 153.232 &&
 					position.y > 0.107;
 		let belowSeaLevel = position.y < 14.989;

 		return !inside && belowSeaLevel;
 	}

 	public outOfBoundsRespawn(body: CANNON.Body, position?: CANNON.Vec3): void
 	{
 		let newPos = position || new CANNON.Vec3(0, 16, 0);
 		let newQuat = new CANNON.Quaternion(0, 0, 0, 1);

 		body.position.copy(newPos);
 		body.interpolatedPosition.copy(newPos);
 		body.quaternion.copy(newQuat);
 		body.interpolatedQuaternion.copy(newQuat);
 		body.velocity.setZero();
 		body.angularVelocity.setZero();
 	}

 	// /**
 	//  * Rendering loop.
 	//  * Implements fps limiter and frame-skipping
 	//  * Calls World.ts's "update" function before rendering.
 	//  * @param {World} world
 	//  */
 	public render(world: World): void
 	{
		this.requestDelta = this.clock.getDelta();

 		// setTimeout(() => world.render(world), 30);

 		// Getting timeStep
 		let unscaledTimeStep = (this.requestDelta + this.renderDelta + this.logicDelta) ;
 		let timeStep = unscaledTimeStep * this.params.Time_Scale;
 		timeStep = Math.min(timeStep, 1 / 30);    // min 30 fps

 		// Logic
 		world.update(timeStep, unscaledTimeStep);

 		// Measuring logic time
 		this.logicDelta = this.clock.getDelta();

 		// Frame limiting
 		let interval = 1 / 60;
 		this.sinceLastFrame += this.requestDelta + this.renderDelta + this.logicDelta;
 		this.sinceLastFrame %= interval;

 		// Actual rendering with a FXAA ON/OFF switch
 		// else
 		// 	this.renderer.render(this.graphicsWorld, this.camera);

 		// TWEEN.update();

 		// Measuring render time
 		this.renderDelta = this.clock.getDelta();
 	}
	 //
 	public setTimeScale(value: number): void
 	{
 		this.params.Time_Scale = value;
 		this.timeScaleTarget = value;
 	}
	 //
 	public add(worldEntity: IWorldEntity): void
 	{
 		worldEntity.addToWorld(this);
 		this.registerUpdatable(worldEntity);
 	}

 	public registerUpdatable(registree: IUpdatable): void
 	{
 		this.updatables.push(registree);
 		this.updatables.sort((a, b) => (a.updateOrder > b.updateOrder) ? 1 : -1);
 	}

 	public remove(worldEntity: IWorldEntity): void
 	{
 		worldEntity.removeFromWorld(this);
 		this.unregisterUpdatable(worldEntity);
 	}

 	public unregisterUpdatable(registree: IUpdatable): void
 	{
 		_.pull(this.updatables, registree);
 	}

 	public loadScene(loadingManager: LoadingManager, gltf: any): void {
		console.log('loadScene');
		gltf.scene.traverse((child) => {
			if(child.name.match('Hammer')){
 				let hammer = new HammerCollider(child);
 				this.physicsWorld.addBody(hammer.bottom);
 				this.physicsWorld.addBody(hammer.body);
 				this.physicsWorld.addConstraint(hammer.hammer);
 				hammer.hammer.enableMotor();
 				//@ts-ignore
 				hammer.hammer.setMotorSpeed(+child.userData.clockwise ? 5 : -5);
 				hammer.hammer.collideConnected = false
 				this.hammers.push(hammer)
 				Utils.setupMeshProperties(child);
 				// this.sky.csm.setupMaterial(child.material);
 			}
			else if (child.name.match('Kettlebell')) {
 					let kettlebell = new KettlebellCollider(child);
 					this.physicsWorld.addBody(kettlebell.hitch);
 					this.physicsWorld.addBody(kettlebell.body);
 					this.physicsWorld.addConstraint(kettlebell.kettlebell);
 					kettlebell.kettlebell.enableMotor();
 					this.kettlebells.push(kettlebell)
 			}
 			else if (child.hasOwnProperty('userData')) {
				console.log('child.userData.type', child.userData?.type);
 				if (child.type === 'Mesh') {
					Utils.setupMeshProperties(child);
				}
				if (child.userData.type === 'player') {
					new CharacterSpawnPoint(child, this);
				}
 				if (child.userData.hasOwnProperty('data')) {
 					if (child.userData.data === 'physics') {
 						if (child.userData.hasOwnProperty('type')) {
 							// Convex doesn't work! Stick to boxes!
 							if (child.userData.type === 'box') {
 								const mass = child.userData.name.match("Box") ? 1 : 0;
 								let phys = new BoxCollider({mass,child, size: new THREE.Vector3(child.scale.x, child.scale.y, child.scale.z)});

 								phys.body.position.copy(Utils.cannonVector(child.position));
 								phys.body.quaternion.copy(Utils.cannonQuat(child.quaternion));
								// phys.body.computeAABB();
								phys.body.aabbNeedsUpdate = true;

 								phys.body.shapes.forEach((shape) => {
 									// shape.collisionFilterMask = ~CollisionGroups.TrimeshColliders;
 								});

 								if(!child.userData.static) this.boxes.push(phys);

 								Utils.setupMeshProperties(child);

 								this.physicsWorld.addBody(phys.body);
 							}
 							else if (child.userData.type === 'trimesh') {
 								// let phys = new TrimeshCollider(child, {});
 								// this.physicsWorld.addBody(phys.body);
 							}
 						}
 					}

 					if (child.userData.data === 'path') {
 						this.paths.push(new Path(child));
 					}

 					if (child.userData.data === 'Scenario.ts') {
 						// this.scenarios.push(new Scenario(child, this));
 					}
 				}
 			}
 		});

 		// Launch default scenario
 		let defaultScenarioID: string;
 		for (const scenario of this.scenarios) {
 			if (scenario.default) {
 				defaultScenarioID = scenario.id;
 				break;
 			}
 		}
 		if (defaultScenarioID !== undefined) this.launchScenario(defaultScenarioID, loadingManager);
 	}

 	public launchScenario(scenarioID: string, loadingManager?: LoadingManager): void
 	{
 		this.lastScenarioID = scenarioID;

 		this.clearEntities();

 		// Launch default scenario
 		if (!loadingManager) loadingManager = new LoadingManager(this);
 		for (const scenario of this.scenarios) {
 			if (scenario.id === scenarioID || scenario.spawnAlways) {
 				scenario.launch(loadingManager, this);
 			}
 		}
 	}

 	// public restartScenario(): void
 	// {
 	// 	if (this.lastScenarioID !== undefined)
 	// 	{
 	// 		// document.exitPointerLock();
 	// 		this.launchScenario(this.lastScenarioID);
 	// 	}
 	// 	else
 	// 	{
 	// 		console.warn('Can\'t restart scenario. Last scenarioID is undefined.');
 	// 	}
 	// }
	 //
 	// public clearEntities(): void
 	// {
 	// 	for (let i = 0; i < this.characters.length; i++) {
 	// 		this.remove(this.characters[i]);
 	// 		i--;
 	// 	}
	 //
 	// 	// for (let i = 0; i < this.vehicles.length; i++) {
 	// 	// 	this.remove(this.vehicles[i]);
 	// 	// 	i--;
 	// 	// }
 	// }
	 //
}

// wait for Ammo to be loaded
_ammo().then(ammo => {
	globalThis.Ammo = ammo

	// start server scene
	// new ServerScene()
})

export default World;
