import * as CANNON from 'cannon';
import { Vector3 } from 'three';
import { ICollider } from '../../interfaces/ICollider';

export class HammerCollider implements ICollider {
  public body: CANNON.Body;
  public bottom: CANNON.Body;
  public hammer: CANNON.HingeConstraint;

  constructor(mesh) {
    let mat = new CANNON.Material('boxMat');
    // mat.friction = 0.3;
    // // mat.restitution = 0.7;

    // // Add phys sphere

    const meshPosition = mesh.position.clone();
    meshPosition.y = 0.2;


    const hammerBottom = new CANNON.Body({
      mass: 10,
      shape: new CANNON.Cylinder(0.8, 0.8, 0.4, 16),
      quaternion: new CANNON.Quaternion(0.707, 0, 0, 0.707),
      position: meshPosition
    });

    const hammer = new CANNON.Body({
      material: mat,
      mass: 0
    });

    hammer.addShape(new CANNON.Cylinder(
        0.55, 0.55, 1.01, 16),
        mesh.position.clone().add(new Vector3(-1.5, 0, 0))
        );

    hammer.addShape(
        new CANNON.Cylinder(0.25, 0.25, 0.7, 16),
        new CANNON.Vec3(-2.1, 1.4, 0),
        new CANNON.Quaternion(0, 0.707, 0, 0.707)
        );

    hammer.addShape(
        new CANNON.Cylinder(0.3, 0.3, 2, 16),
        new CANNON.Vec3(-1.48, 1.4, 0),
        new CANNON.Quaternion(0.707, 0, 0, 0.707)
        );
    const q = new CANNON.Quaternion()
    q.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), Math.PI/2)

    
    this.body = new CANNON.Body({
        shape: new CANNON.Cylinder(1, 1, 2, 16),
        position: new CANNON.Vec3(0, 2, -3),
        quaternion: q
    });//hammer
    //hammer.quaternion = new CANNON.Quaternion(0, 0.707 ,0,0.707)
    //this.bottom = hammerBottom

    // this.hammer = new CANNON.HingeConstraint(hammerBottom,hammer, {
    //   pivotA: new CANNON.Vec3(0, 0, 0),
    //   pivotB: new CANNON.Vec3(0, 0, ),
    //   axisA: new CANNON.Vec3(1, 1, 0),
    //   axisB: new CANNON.Vec3(0, 1, 0)
    // });
  }
}
