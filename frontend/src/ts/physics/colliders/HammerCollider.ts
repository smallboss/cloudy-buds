import * as CANNON from 'cannon';
import { ICollider } from '../../interfaces/ICollider';

export class HammerCollider implements ICollider {
  public body: CANNON.Body;
  public bottom: CANNON.Body;
  public hammer: CANNON.HingeConstraint;
  public mesh: THREE.Mesh

  constructor(mesh) {
    let mat = new CANNON.Material('HammerMat');
    mat.friction = 0;
    mat.restitution = 0;

    // // Add phys sphere
    this.mesh = mesh
    const meshPosition = mesh.position.clone();
    meshPosition.y = 0.1;


    this.bottom = new CANNON.Body({
      mass: 0,
      shape: new CANNON.Box(new CANNON.Vec3(0.4, 0.1, 0.4)),
      position: meshPosition,
      material: mat
    });

    this.body = new CANNON.Body({
      material: mat,
      mass: 10,
    });

    this.body.addShape(
      new CANNON.Cylinder(0.3, 0.3, 1.4, 16),
      );

    this.body.addShape(
        new CANNON.Cylinder(0.25, 0.25, 0.7, 16),
        new CANNON.Vec3(-0.6, 0, 0),
        new CANNON.Quaternion(0, -0.707, 0, 0.707)
        );

    this.body.addShape(
      new CANNON.Cylinder(0.35, 0.35, 1.01, 16),
      new CANNON.Vec3(-1, 0, 0),
      new CANNON.Quaternion(0.707, 0,0, 0.707)
        );

    this.hammer = new CANNON.HingeConstraint(this.bottom ,this.body, {
      pivotA: new CANNON.Vec3(0, -0.25, 0),
      pivotB: new CANNON.Vec3(0, 0, 1),
      axisA: new CANNON.Vec3(0, 1, 0),
      axisB: new CANNON.Vec3(0, 0, 1)
    });
  }
  update = () => {
    //@ts-ignore
    this.mesh.quaternion.copy(this.body.quaternion)
  }
}
