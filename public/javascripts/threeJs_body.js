import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// export function init() {
//   const container = document.getElementById("container");

//   container.appendChild(renderer.domElement);
// }

const scene = new THREE.Scene();
scene.background = new THREE.Color("black");
const camera = new THREE.PerspectiveCamera(
  25,
  window.innerWidth / window.innerHeight,
  0.5,
  1000
);

camera.position.set(0, 0, 5);

//initialization
const loader = new GLTFLoader();

//actual light
let PLight = new THREE.PointLight();
let ALight = new THREE.AmbientLight();
let SLight = new THREE.SpotLight("white", 5, 60, Math.PI * 0.2, 1, 1);

SLight.position.set(0, 5, 10);

ALight.intensity = 5;
PLight.position.set(0, 50, 50);
PLight.intensity = 5;
scene.add(PLight, ALight, SLight);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
  antialias: true,
});

renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);

loader.load("./assets/free_datsun_280z.glb", function (gltf) {
  scene.add(gltf.scene);
  renderer.render(scene, camera); // 랜더링
});

function animate() {
  requestAnimationFrame(animate);
  scene.rotation.y += 0.001;
  renderer.render(scene, camera);
}
animate();

// OrbitControls를 생성하고 카메라를 연결합니다.
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = true; // 줌 기능 활성화

// 이벤트 리스너를 추가하여 마우스 휠로 줌 인/아웃을 할 수 있도록 합니다.
renderer.domElement.addEventListener("wheel", function (event) {
  const deltaY = event.deltaY;
  const maxZoom = 30; // 최대 줌 인 값
  const minZoom = 2; // 최소 줌 아웃 값
  // 카메라의 z 위치를 조정하여 줌 인/아웃 효과를 줍니다.
  if (deltaY !== 0) {
    camera.position.z += deltaY * 0.05; // 마우스 휠 방향에 따라 카메라의 z 위치를 조정
    // 카메라의 위치가 최소/최대 값을 넘지 않도록 조정합니다.
    camera.position.z = THREE.MathUtils.clamp(
      camera.position.z,
      minZoom,
      maxZoom
    );
  }
});
// // THREE.AmbientLight(color, intensity)

// let light = new THREE.AmbientLight();

// light.color = 0xffff00;
// light.intensity = 5;

// //about THREE.light methods
// // THREE.HemisphereLight(skyColor, groundColor, intensity);

// let light = new THREE.HemisphereLight(0xffff00, 0xff0000, 0.3);

// // THREE.DirectionalLight(color, intensity);

// let light = new THREE.DirectionalLight(0xffff00, 0.7);

// // Three.PointLight(color, intensity, distance, decay);

// let light = new THREE.PointLight(0xffffff, 0.5, 15, 3);

// // THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);

// let light = new THREE.SpotLight(0x00ff00, 1, 30, Math.PI * 0.2, 0.1, 1);

// // THREE.RectAreaLight(color, intensity, width, height);

// let light = new THREE.RectAreaLight(0xffff00, 0.5, 20, 20);

// making a rotating 3d square
//rendering a cube
// document.body.appendChild(renderer.domElement);

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
// const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// camera.position.z = 5;

// function animate() {
//   requestAnimationFrame(animate);
//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;
//   renderer.render(scene, camera);
// }
// animate();

// // Drawing lines
// const renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );

// const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
// camera.position.set( 0, 0, 100 );
// camera.lookAt( 0, 0, 0 );

// const scene = new THREE.Scene();

// const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

// const points = [];
// points.push( new THREE.Vector3( - 10, 0, 0 ) );
// points.push( new THREE.Vector3( 0, 10, 0 ) );
// points.push( new THREE.Vector3( 10, 0, 0 ) );

// const geometry = new THREE.BufferGeometry().setFromPoints( points );

// const line = new THREE.Line( geometry, material );

// scene.add( line );
// renderer.render( scene, camera );

// Creating text
