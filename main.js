var stage, world, scene, controls;
var camera, body, mesh;

/* Object Factory - 
		returns a combined Three JS/Cannon JS object */
var ObjectFactory = function() {
	this.geoms = {
		box: new THREE.BoxGeometry(1, 1, 1)
	};

	var glassMaterial = new THREE.MeshPhongMaterial( { color: 0x000000, shininess: 100 } );
  glassMaterial.transparent = true;
  glassMaterial.opacity = 0.3;
  glassMaterial.specular.setRGB( 1, 1, 1 );

	this.materials = {
		wall: new THREE.MeshLambertMaterial({color: 0xffffff}),
		glass: glassMaterial,
		ground: new THREE.MeshLambertMaterial({color: 0x151515})
	}
}

ObjectFactory.prototype.addStaticBox = function(params, material) {
	var sx = params.size[0]/100, sy = params.size[1]/100, sz = params.size[2]/100;
	var px = params.pos[0]/100, py = params.pos[1]/100, pz = params.pos[2]/100;
	var shape = new CANNON.Box(new CANNON.Vec3(sx, sy, sz));
	var bodey = new CANNON.Body({ mass: 1, type: CANNON.Body.STATIC});
	bodey.addShape(shape);
	bodey.position.set(px, py, pz);
	world.add(bodey);

	var meseh = new THREE.Mesh(this.geoms.box, material ? this.materials[material] : this.materials.wall);
	meseh.scale.set(sx, sy, sz);
	meseh.position.set(px, py, pz);
	scene.add(meseh);

	return {mesh: meseh, body: bodey};
}

/* Stage - manages the elements in the game */
var Stage = function() {
	this.objects = [];
	this.ObjectFactory = new ObjectFactory();

	initCannon();
	initThree();

	this.populate();

	requestAnimationFrame(animate);
}

Stage.prototype.populate = function() {
	this.buildSet();
}

Stage.prototype.buildSet = function() {
	this.objects.push(this.ObjectFactory.addStaticBox({
		size: [398, 25, 200], pos: [0, 13, -184]}
		));
	this.objects.push(this.ObjectFactory.addStaticBox(
		{size: [400, 400, 20], pos: [0, 226, -186]}
		));
	this.objects.push(this.ObjectFactory.addStaticBox(
		{size: [400, 25, 500], pos: [0, -12, -156]}
		));
	this.objects.push(this.ObjectFactory.addStaticBox(
		{size: [400, 330, 2], pos: [0, 226, -165]}, 'glass'
		));
	this.objects.push(this.ObjectFactory.addStaticBox(
		{size: [50, 50, 400], pos: [-225, 0, 0]}
		));
	this.objects.push(this.ObjectFactory.addStaticBox(
		{size: [50, 50, 400], pos: [225, 0, 0]}
		));
	this.objects.push(this.ObjectFactory.addStaticBox(
		{size: [400, 50, 400], pos: [0, -50, 0]}, 'ground'
		));
}

stage = new Stage();
console.log(stage);

/* Set up Cannon JS world */
function initCannon() {
	world = new CANNON.World();
	world.gravity.set(0,0,0);
	world.broadphase = new CANNON.NaiveBroadphase();
	world.solver.iterations = 10;

	/*var shape = new CANNON.Box(new CANNON.Vec3(1,1,1));
	body = new CANNON.Body({ mass: 1 });
	body.addShape(shape);
	body.angularVelocity.set(0,10,0);
	body.angularDamping = 0.5;

	world.add(body);*/
}

/* Set up Three JS world */
function initThree() {
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 1, 100);
	camera.position.z = 5;
	scene.add(camera);

	controls = new THREE.OrbitControls( camera );

	var light = new THREE.DirectionalLight(0xffffff, 1.3);
  light.position.set(0.3, 1, 0.5);
  scene.add(light);

	

	/*var geometry = new THREE.BoxGeometry(2,2,2);
	var material = new THREE.MeshLambertMaterial({color: "#ff0000"});

	mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);*/

	scene.add( new THREE.AmbientLight( 0x383838 ) );

	renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);

	document.body.appendChild(renderer.domElement);
}

/* Animation loop */
function animate() {
	updatePhysics();
	controls.update();
	render();
	requestAnimationFrame(animate);
}

/* Update all objects in the scene */
function updatePhysics() {
  // Step the physics world
  world.step(1/60);

  // Copy coordinates from Cannon.js to Three.js
  stage.objects.forEach(function(o) {
	  o.mesh.position.copy(o.body.position);
	  o.mesh.quaternion.copy(o.body.quaternion);
	});
}

/* Render the scene */
function render() {
  renderer.render( scene, camera );
}