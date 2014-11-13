var stage, world, scene, controls;
var camera, body, mesh;

var SEGMENTS = 6;

/* Object Factory - 
		returns a combined Three JS/Cannon JS object */
var ObjectFactory = function() {
	this.COIN_PARAMS = {
		radius: 15/100, height: 1/100
	}

	this.geoms = {
		box: new THREE.BoxGeometry(1, 1, 1),
		coin: new THREE.CylinderGeometry(this.COIN_PARAMS.radius,this.COIN_PARAMS.radius,this.COIN_PARAMS.height,SEGMENTS)
	};

	var glassMaterial = new THREE.MeshPhongMaterial( { color: 0x000000, shininess: 100 } );
  glassMaterial.transparent = true;
  glassMaterial.opacity = 0.3;
  glassMaterial.specular.setRGB( 1, 1, 1 );

	this.materials = {
		wall: new THREE.MeshLambertMaterial({color: 0xffffff}),
		glass: glassMaterial,
		ground: new THREE.MeshLambertMaterial({color: 0x151515}),
		coin: new THREE.MeshLambertMaterial({color: 0xff0000})
	}
}

ObjectFactory.prototype.addBox = function(params, material, paddle) {
	var sx = params.size[0]/100, sy = params.size[1]/100, sz = params.size[2]/100;
	var px = params.pos[0]/100, py = params.pos[1]/100, pz = params.pos[2]/100;
	var shape = new CANNON.Box(new CANNON.Vec3(sx/2, sy/2, sz/2));
	var bodey = new CANNON.Body({ mass: paddle ? 10 : 0 });
	bodey.addShape(shape);
	bodey.position.set(px, py, pz);
	world.add(bodey);

	var meseh = new THREE.Mesh(this.geoms.box, material ? this.materials[material] : this.materials.wall);
	meseh.scale.set(sx, sy, sz);
	meseh.position.set(px, py, pz);
	scene.add(meseh);

	return {mesh: meseh, body: bodey};
}

ObjectFactory.prototype.addCoin = function(params) {
	var px = params.pos[0]/100, py = params.pos[1]/100, pz = params.pos[2]/100;
	var shape = new CANNON.Cylinder(this.COIN_PARAMS.radius,this.COIN_PARAMS.radius,this.COIN_PARAMS.height,SEGMENTS);
	
	var q = new CANNON.Quaternion();
  q.setFromEuler(Math.PI/2, 0, 0);
  shape.transformAllPoints(new CANNON.Vec3(), q);

	var bodey = new CANNON.Body({ mass: 1 });
	bodey.addShape(shape);
	bodey.position.set(px, py, pz);
	q.setFromEuler(Math.PI/2, Math.PI/4, 0);
	bodey.quaternion.copy(q);
	
	world.add(bodey);

	var meseh = new THREE.Mesh(this.geoms.coin, this.materials.coin);
	//meseh.position.set(px, py, pz);
	meseh.rotation.x = Math.PI / 2;
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
	this.fillCoins();
}

Stage.prototype.buildSet = function() {
	this.paddle = this.ObjectFactory.addBox(
		{size: [398, 25, 200], pos: [0, 13, -184]}, 'wall', true
		);
	this.objects.push(this.paddle);
	this.objects.push(this.ObjectFactory.addBox(
		{size: [400, 400, 20], pos: [0, 226, -186]}
		));
	this.objects.push(this.ObjectFactory.addBox(
		{size: [400, 25, 500], pos: [0, -12, -156]}
		));
	this.objects.push(this.ObjectFactory.addBox(
		{size: [400, 330, 2], pos: [0, 226, -165]}, 'glass'
		));
	this.objects.push(this.ObjectFactory.addBox(
		{size: [50, 50, 400], pos: [-225, 0, 0]}
		));
	this.objects.push(this.ObjectFactory.addBox(
		{size: [50, 50, 400], pos: [225, 0, 0]}
		));
	this.objects.push(this.ObjectFactory.addBox(
		{size: [400, 50, 400], pos: [0, -50, 0]}, 'ground'
		));
}

Stage.prototype.fillCoins = function() {
	for (var i = 0; i < 80; i++)
		this.objects.push(this.ObjectFactory.addCoin(
			{pos: [Math.random()*400-200, 100, Math.random()*400-200]}, 'coin', true
			));
}

Stage.prototype.movePaddle = function() {
	this.paddle.body.velocity.z += 2;
	/*if (this.paddle.body.velocity.z >= 0 && this.paddle.body.position.z < -1.1) {
      if (this.paddle.body.velocity.z < 0.6) {
       this.paddle.body.velocity.z += 0.08;
      }
      //myBody.body.position.z += 0.03;
    } else if (this.paddle.body.position.z > -1.85) {
      if (this.paddle.body.velocity.z > 0) this.paddle.body.velocity.z = 0;
      if (this.paddle.body.velocity.z > -0.6) {
       this.paddle.body.velocity.z -= 0.08;
      }
      //myBody.body.position.z -= 0.03;
    } else {
      this.paddle.body.velocity.z = 0;
      count = 0;
    }*/
}

stage = new Stage();
console.log(stage);

/* Set up Cannon JS world */
function initCannon() {
	world = new CANNON.World();
	world.gravity.set(0,-10,0);
	world.broadphase = new CANNON.NaiveBroadphase();
	world.solver.iterations = 10;
	world.solver.tolerance = 0.001;

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
	camera.position.y = 3;
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
	stage.movePaddle();
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