import * as CANNON from 'cannon-es';
import { threeQuat } from '../../core/FunctionLibrary.ts';
import { ICollider } from '../../interfaces/ICollider';

export class KettlebellCollider implements ICollider {
  public body: CANNON.Body;
  public hitch: CANNON.Body;
  public mesh: THREE.Mesh
  public kettlebell: CANNON.HingeConstraint

  constructor(mesh) {
    let mat = new CANNON.Material('DynamicBarrierMat');
    mat.friction = 0;
    mat.restitution = 0;
    const kettlebellRadius = 1;

    // // Add phys sphere
    this.mesh = mesh

    this.hitch = new CANNON.Body({
        mass:0,
        position: mesh.position.clone(),
        shape: new CANNON.Box(new CANNON.Vec3(.1, .1, .1))
    })
    
    this.body = new CANNON.Body({
      material: mat,
      mass: 1000,
      shape: new CANNON.Sphere(kettlebellRadius),
      position: mesh.position.clone().setY(kettlebellRadius),
      velocity: new CANNON.Vec3(+mesh.userData.rtl ? 10 : -10, -1, -1)
    });

    this.kettlebell = new CANNON.HingeConstraint(this.hitch ,this.body,
         {
        pivotA: new CANNON.Vec3(0, 0, 0),
        pivotB: new CANNON.Vec3(0, 15.7, 0),
        axisA: new CANNON.Vec3(0, 0, 0),
        axisB: new CANNON.Vec3(0, 0, 0),
      }
      );
  }
  update = () => {
      this.mesh.quaternion.copy(threeQuat(this.body.quaternion))
      this.mesh.rotateZ(Math.PI)
  }
}
