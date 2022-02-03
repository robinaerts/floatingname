import "./style/main.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap"; // Animation library
import * as dat from "dat.gui"; // Debug library

const canvas = document.querySelector(".webgl");

//# TEXTURES

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader();

// loadingManager.onStart = () => {
//   console.log("Started loading");
// };
// loadingManager.onLoad = () => {
//   console.log("finished loading");
// };
// loadingManager.onProgress = () => {
//   console.log("Loading");
// };
// loadingManager.onError = () => {
//   console.log("Error");
// };

// Load texture with 3 callbacks: load, progress and error
// const moonTexture = textureLoader.load("/textures/moon.jpg");
const moonTexture = textureLoader.load("/textures/minecraft.png");

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const matcapTexture = textureLoader.load("/textures/matcaps/2.png");
const matcapTexture2 = textureLoader.load("/textures/matcaps/1.png");
const gradientTexture = textureLoader.load("/textures/gradients/3.jpg");

// for fixing mipmapping on small texture
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;
gradientTexture.generateMipmaps = false;

// Repeat last pixel
// moonTexture.repeat.x = 2;
// moonTexture.repeat.y = 3;

// Repeat texture
// moonTexture.wrapS = THREE.RepeatWrapping;
// moonTexture.wrapT = THREE.RepeatWrapping;

// Mirror texture
// moonTexture.wrapS = THREE.MirroredRepeatWrapping;
// moonTexture.wrapT = THREE.MirroredRepeatWrapping;

// Offset texture
// moonTexture.offset.x = 0.5;
// moonTexture.offset.y = 0.5;

// Rotate texture (in radiants) and center the texture
// moonTexture.rotation = 1;
// moonTexture.center.x = 0.5;
// moonTexture.center.y = 0.5;

//* Minification and Magnification Filters
// Don't need mipmaps when using nearestfilter
moonTexture.generateMipmaps = false;
moonTexture.minFilter = THREE.NearestFilter;
// For low res textures, to remove the blur
moonTexture.magFilter = THREE.NearestFilter;

//* Environment map
const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.jpg",
  "/textures/environmentMaps/0/py.jpg",
  "/textures/environmentMaps/0/pz.jpg",
  "/textures/environmentMaps/0/nx.jpg",
  "/textures/environmentMaps/0/ny.jpg",
  "/textures/environmentMaps/0/nz.jpg",
]);

//# TEXT

const fontLoader = new THREE.FontLoader(); // Only loads .json fonts
fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new THREE.TextBufferGeometry("Robin", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });

  //* Center the text (hard way)
  // textGeometry.computeBoundingBox();
  // textGeometry.translate(
  //   -(textGeometry.boundingBox.max.x - 0.02) / 2,
  //   -(textGeometry.boundingBox.max.y - 0.02) / 2,
  //   -(textGeometry.boundingBox.max.z -0.03) / 2
  // );

  //* Easy Way
  textGeometry.center();

  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const text = new THREE.Mesh(textGeometry, textMaterial);

  scene.add(text);

  const donutGeometry = new THREE.TorusBufferGeometry(0.3, 0.2, 20, 45);
  const donutMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture2,
  });

  for (let i = 0; i < 500; i++) {
    const donut = new THREE.Mesh(donutGeometry, donutMaterial);

    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;
    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = Math.random();
    donut.scale.set(scale, scale, scale);
    scene.add(donut);
  }
});

//* CURSOR
const cursor = {
  x: 0,
  y: 0,
};
window.addEventListener("mousemove", (e) => {
  // divide by sizes.width and -0.5 so that you get a value between -0.5 and 0.5 regardless of the device.
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;
});

//* Parameters for the debug panel
const parameters = {
  color: 0xefba13,
  spin: () => {
    gsap.to(cube2.rotation, { duration: 1, y: cube2.rotation.y + Math.PI * 2 });
  },
};

//# Create a scene
const scene = new THREE.Scene();

//# Add objects to scene
const cubeGroup = new THREE.Group();
// scene.add(cubeGroup);

//* CREATE OWN GEOMETRIES
// const geometry = new THREE.Geometry();

// const vertex1 = new THREE.Vector3(0, 0, 0);
// const vertex2 = new THREE.Vector3(0, 1, 0);
// const vertex3 = new THREE.Vector3(1, 0, 0);
// geometry.vertices.push(vertex1);
// geometry.vertices.push(vertex2);
// geometry.vertices.push(vertex3);

//* Create face of geometry between vertices 0,1 and 2
// const face = new THREE.Face3(0, 1, 2);
// geometry.faces.push(face);

//* WITH BUFFER GEOMETRIES
// const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);
// const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
// const geometry = new THREE.BufferGeometry();
// geometry.setAttribute("position", positionsAttribute);

//* ADD CUBES
const cube1 = new THREE.Mesh(
  // width, height, depth, widthSegments (subdivisions), heightSegments, depthSegments
  new THREE.BoxGeometry(1, 1, 1, 2, 2, 2),
  // Wireframe: true, shows outlines
  new THREE.MeshBasicMaterial({ color: "red", wireframe: false })
);
const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: "green" })
);
const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: parameters.color })
);

cubeGroup.add(cube1, cube2, cube3);

cube2.position.x = 1.5;
cube3.position.z = -2;

cubeGroup.position.x = 1.5;

//* Create geometry and material for mesh
// const geometry = new THREE.BoxGeometry(1, 1, 1);

// BoxBufferGeometry is more optimized
const geometry = new THREE.BoxBufferGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ map: moonTexture });

//* Initialize mesh with geometry and material
const cube = new THREE.Mesh(geometry, material);
// scene.add(cube);

// cube.scale.x = 2;
// cube.scale.set(2, 0.5, 0.5);

//* Change order in which the rotation is being applied
// cube.rotation.reorder("YXZ");
// cube.rotation.y = 2;
// cube.rotation.x = 1.5;

// cube.position.set(2, 2, 1); // set position x,y,z

// Takes vector length and reduce it to 1
// cube.position.normalize();

//# DEBUG UI

/* Different libraries:
- dat.GUI
- control-panel
- ControlKit
- Guify
- Oui */

//* Initiate gui panel
// const gui = new dat.GUI();

//* Add a tweak (range, color, text, checkbox, select, button, folder)
// last three arguments: Min, Max, Step
// gui.add(cubeGroup.position, "x", -3, 3, 0.1);
// OR
// gui.add(cubeGroup.position, "y").min(-3).max(3).step(0.1).name("elevation");
// gui.add(cubeGroup, "visible");
// gui.add(cube1.material, "wireframe");

// gui.addColor(parameters, "color").onChange(() => {
//   cube3.material.color.set(parameters.color);
// });

// gui.add(parameters, "spin");

//# CAMERA
const sizes = { width: window.innerWidth, height: window.innerHeight };

// On resize change sizes
window.addEventListener("resize", () => {
  // update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // update camera aspect ratio
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  //update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // If someone would put the window in another screen, with another pixel ratio
});

// On double click, enter fullscreen mode
window.addEventListener("dblclick", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    canvas.requestFullscreen();
  }
});

// Create perspective camera with 75° FOV, aspect ratio, near and far
// (any objects closer than 'near' or further than 'far' will not show up)
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.01,
  100 // If extreme values, problem of z-fighting can occur.
);

// Orthographic camera with 'left', 'right', 'top' and 'bottom', then the 'near' and 'far'.
// multiply the left and right values with the aspectratio, so you don't get misformed objects

// const aspectRatio = sizes.width / sizes.height;
// const camera = new THREE.OrthographicCamera(
//   -2 * aspectRatio,
//   2 * aspectRatio,
//   2,
//   -2,
//   0.1,
//   100
// );

// camera.position.y = 1;
// camera.position.x = -1;
camera.position.z = 3;
// camera.position.y = 2;
scene.add(camera);

camera.lookAt(cubeGroup.position);

// use orbitcontrols with camera and DOM element
const controls = new OrbitControls(camera, canvas);

// Change target of controls and enable damping (for damping controls has to be updated every frame)
controls.target.x = 2;
controls.update();
controls.enableDamping = true;

// Axes helper (with property for length)
const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

// console.log(camera.position.distanceTo(cube.position));
// console.log(camera.position.distanceTo(new THREE.Vector3(1, 1, 1)));

//# LIGHTING

const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(ambientLight, pointLight);

//# MATERIALS

//* MeshBasicMaterial

// const basicMaterial = new THREE.MeshBasicMaterial();
// myMaterial.color.set(0xffff00);
// basicMaterial.map = doorColorTexture;
// myMaterial.wireframe = true;
// myMaterial.opacity = 0.5;
// basicMaterial.transparent = true;
// basicMaterial.alphaMap = doorAlphaTexture;
// basicMaterial.side = THREE.DoubleSide;

//* MeshNormalMaterial (for the normals)

// const normalMaterial = new THREE.MeshNormalMaterial();
// normalMaterial.flatShading = true;

//* MeshMatcapMaterial (simulate light and shadows)

// const matcapMaterial = new THREE.MeshMatcapMaterial();
// matcapMaterial.matcap = matcapTexture;

//* MeshDepthMaterial (white when close to near of camera)
// const depthMaterial = new THREE.MeshDepthMaterial();

//* MeshLambertMaterial (reacts to light)
// const lambertMaterial = new THREE.MeshLambertMaterial();

//* MeshPhongMaterial (same as meshlambertmaterial, but with light bounces and without artefacts )
// const phongMaterial = new THREE.MeshPhongMaterial();
// phongMaterial.shininess = 100;
// phongMaterial.specular = new THREE.Color("yellow");

//* MeshToonMaterial (same as lambert, but cartoonish)
// const toonMaterial = new THREE.MeshToonMaterial();
// toonMaterial.gradientMap = gradientTexture;

//* MeshStandardMaterial (uses PBR and is better)
const standardMaterial = new THREE.MeshStandardMaterial();
standardMaterial.metalness = 0.7;
standardMaterial.roughness = 0.2;
// standardMaterial.map = doorColorTexture;
// standardMaterial.aoMap = doorAmbientOcclusionTexture;
// standardMaterial.aoMapIntensity = 2;
// standardMaterial.displacementMap = doorHeightTexture;
// standardMaterial.displacementScale = 0.05;
// standardMaterial.metalnessMap = doorMetalnessTexture;
// standardMaterial.roughnessMap = doorRoughnessTexture;
// standardMaterial.normalMap = doorNormalTexture;
// standardMaterial.normalScale.set(0.5, 0.5);
// standardMaterial.alphaMap = doorAlphaTexture;
// standardMaterial.transparent = true;
standardMaterial.envMap = environmentMapTexture;

// const f1 = gui.addFolder("StandardMaterial");
// f1.add(standardMaterial, "metalness").min(0).max(1).step(0.0001);
// f1.add(standardMaterial, "roughness").min(0).max(1).step(0.0001);
// f1.add(standardMaterial, "aoMapIntensity").min(0).max(10).step(0.5);
// f1.add(standardMaterial, "displacementScale").min(0).max(1).step(0.0001);

//* MeshPhysicalMaterial (same as standarmaterial) but with clear coat effect

const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 64, 64),
  standardMaterial
);
sphere.position.x = -1.5;

const plane = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(1, 1, 100, 100),
  standardMaterial
);
const torus = new THREE.Mesh(
  new THREE.TorusBufferGeometry(0.5, 0.2, 64, 128),
  standardMaterial
);

// Add second uv coordinates for the ambient occlussion texture to work
plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);
sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);
torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);

torus.position.x = 1.5;
// scene.add(sphere, plane, torus);

//# RENDERER

// Create renderer with canvas selected from DOM and give the renderer a size
const renderer = new THREE.WebGLRenderer({
  canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance reasons

// Render scene with camera
renderer.render(scene, camera);

// animation with gsap
// gsap.to(cube2.position, { x: 2, duration: 1, delay: 0.5 });
// gsap.to(cube2.position, { x: 0, duration: 1, delay: 0.5 });

// For calculating delta time, second one is build in in THREEjs
let time = Date.now();
const clock = new THREE.Clock();

//# ANIMATION LOOP
const loop = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update Objects (for material section)
  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.1 * elapsedTime;
  plane.rotation.x = 0.1 * elapsedTime;
  torus.rotation.x = 0.1 * elapsedTime;

  //   const currentTime = Date.now();
  //   const deltaTime = currentTime - time;
  //   time = currentTime;
  //   cube1.rotation.y = elapsedTime;
  //   camera.position.x = Math.sin(elapsedTime);

  // change cameras rotation based on the cursor
  //   camera.rotation.y = cursor.x * Math.PI;
  //   camera.rotation.x = cursor.y * Math.PI;

  // change cameras position based on the cursor
  //   camera.position.x = -cursor.x * 10;
  //   camera.position.y = cursor.y * 10;

  // Look around object
  //   camera.position.x = Math.sin(cursor.x * Math.PI) * 3;
  //   camera.position.z = Math.cos(cursor.x * Math.PI) * 3;
  //   camera.position.y = cursor.y * 5;

  //   camera.lookAt(cube2.position);
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};

loop();
