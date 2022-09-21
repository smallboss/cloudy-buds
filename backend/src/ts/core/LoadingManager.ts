import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { LoadingTrackerEntry } from './LoadingTrackerEntry.ts';
import { Scenario } from '../world/Scenario.ts';
import { World } from '../world/World.ts';
import {default as AMMONodejs} from '@enable3d/ammo-on-nodejs';

export class LoadingManager
{
	public firstLoad: boolean = true;
	public onFinishedCallback: () => void;

	private world: World;
	private gltfLoader: AMMONodejs.Loaders.GLTFLoader;
	private loadingTracker: LoadingTrackerEntry[] = [];

	constructor(world?: World)
	{
		this.world = world;
		this.gltfLoader = new AMMONodejs.Loaders.GLTFLoader();

		if (this.world) {
			this.world.setTimeScale(0);
		}
	}

	public loadGLTF(path: string, onLoadingFinished: (gltf: any) => void): void {
		let trackerEntry = this.addLoadingEntry(path);

		this.gltfLoader.load(path)
			.then(gltf => {
				onLoadingFinished(gltf);
				this.doneLoading(trackerEntry);
			});

		// this.gltfLoader.load(path, (gltf)  => {
		// 	onLoadingFinished(gltf);
		// 	this.doneLoading(trackerEntry);
		// },
		// (xhr) => {
		// 	if ( xhr.lengthComputable ) {
		// 		trackerEntry.progress = xhr.loaded / xhr.total;
		// 	}
		// },
		// (error)  => console.error(error));
	}

	public addLoadingEntry(path: string): LoadingTrackerEntry {
		let entry = new LoadingTrackerEntry(path);
		this.loadingTracker.push(entry);

		return entry;
	}

	public doneLoading(trackerEntry: LoadingTrackerEntry): void {
		trackerEntry.finished = true;
		trackerEntry.progress = 1;

		if (this.isLoadingDone()) {
			if (this.onFinishedCallback !== undefined) {
				this.onFinishedCallback();
			}
		}
	}

	public createWelcomeScreenCallback(scenario: Scenario): void {
		if (this.onFinishedCallback === undefined) {
			this.onFinishedCallback = () => {
				this.world?.update(1, 1);
			};
		}
	}

	private getLoadingPercentage(): number
	{
		let done = true;
		let total = 0;
		let finished = 0;

		for (const item of this.loadingTracker)
		{
			total++;
			finished += item.progress;
			if (!item.finished) done = false;
		}

		return (finished / total) * 100;
	}

	private isLoadingDone(): boolean
	{
		for (const entry of this.loadingTracker) {
			if (!entry.finished) return false;
		}
		return true;
	}
}
