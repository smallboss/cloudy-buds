import * as CANNON from 'cannon-es';
import * as THREE from 'three';
import * as Utils from '../../core/FunctionLibrary.ts';
import { ICollider } from '../../interfaces/ICollider.ts';

export class BoxCollider implements ICollider
{
	public options: any;
	public body: CANNON.Body;
	public debugModel: THREE.Mesh;

	constructor(options: any)
	{
		let defaults = {
			mass: 0,
			position: new THREE.Vector3(),
			size: new THREE.Vector3(0.3, 0.3, 0.3),
			friction: 0.3
		};
		options = Utils.setDefaults(options, defaults);
		this.options = options;

		options.position = new CANNON.Vec3(options.position.x, options.position.y, options.position.z);
		options.size = new CANNON.Vec3(options.size.x, options.size.y, options.size.z);

		let mat = new CANNON.Material('boxMat');
		mat.friction = options.friction;

		let shape = new CANNON.Box(options.size);

		// Add phys sphere
		let physBox = new CANNON.Body({
			mass: options.mass,
			position: options.position,
			shape,
			material: mat
		});

		this.body = physBox;
	}
	update = () => {
			this.options.child.position.copy(Utils.threeVector(this.body.position));
			this.options.child.quaternion.copy(Utils.threeQuat(this.body.quaternion));
	}
}
