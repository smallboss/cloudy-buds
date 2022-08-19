import {
  Scene,
  Color,
  PerspectiveCamera,
  WebGLRenderer,
  PCFSoftShadowMap,
  AnimationClip,
  AnimationMixer,
  Clock,
  Group,
  MeshStandardMaterial,
  Mesh,
  PlaneBufferGeometry,
  HemisphereLight,
  DirectionalLight,
  Vector2,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "three/examples/jsm/libs/stats.module";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

let mixer: AnimationMixer;
const clock = new Clock();
const stats = Stats();
document.body.appendChild(stats.dom);

const gui = new dat.GUI();

const scene = new Scene();
scene.background = new Color(0xffffff);

const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0.3, 0.8);

const renderer = new WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const hemiLight = new HemisphereLight(0xffffff, 0x444444, 0.9);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);

const dirLight = new DirectionalLight(0xffffff);
dirLight.position.set(0, 1, 0.8);
dirLight.castShadow = true;
dirLight.shadow.camera.top = 1;
dirLight.shadow.camera.bottom = -1;
dirLight.shadow.camera.left = -1;
dirLight.shadow.camera.right = 1;
dirLight.shadow.mapSize = new Vector2(512 * 2, 512 * 2);

scene.add(dirLight);

const controls = new OrbitControls(camera, renderer.domElement);

const ground: Mesh = new Mesh(
  new PlaneBufferGeometry(10, 10),
  new MeshStandardMaterial({ color: 0x00ff00 })
);
ground.rotateX(-Math.PI / 2);
ground.receiveShadow = true;
scene.add(ground);

const loader = new GLTFLoader();

let model: Group;

interface animationClip {
  [key: string]: AnimationClip;
}

const animationFiles = [
  ["fall", "MM_Fall_Loop_Retargeted"],
  ["idle", "MM_Idle_Retargeted"],
  ["jump", "MM_Jump_Retargeted"],
  ["land", "MM_Land_Retargeted"],
  ["fwd", "MM_Walk_Fwd_Retargeted"],
  ["in_place", "MM_Walk_InPlace_Retargeted"],
];

const animationClips: animationClip = {};
let heroAction;

loader.setPath("./assets/models/animations/");
const loadAnimations = (array: string[][]) => {
  return array.map((animFile) => {
    return new Promise<void>((res, rej) => {
      loader.load(
        `${animFile[1]}.glb`,
        (glb) => {
          animationClips[animFile[0]] = glb.animations[0];
          res();
        },
        (xhr) => {},
        (err) => rej(err)
      );
    });
  });
};

Promise.all(loadAnimations(animationFiles)).then(() => {
  loader.setPath("./assets/models/");
  loader.load("base_sk.glb", (glb) => {
    model = glb.scene;
    model.scale.set(0.1, 0.1, 0.1);
    model.traverse((child: any) => {
      if (child.isMesh) child.castShadow = true;
    });
    mixer = new AnimationMixer(model);
    heroAction = mixer.clipAction(animationClips.idle);
    scene.add(model);
    heroAction.play();
  });
});

const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "z", 5, 100);
cameraFolder.open();

window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  render();
}

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  if (mixer) mixer.update(delta);
  controls.update();

  stats.update();

  render();
}

function render() {
  renderer.render(scene, camera);
}
animate();
