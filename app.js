var DOT_SIZE = 16;
var DISC_SIZE = 160;

var a = 2;

// three var
var camera, scene, light, renderer, controls, container, center;
var meshs = [];


//oimo var
var world;
var bodys = [];


var boxGeom = new THREE.BoxGeometry(100, 100, 100);

var cylGeom = new THREE.CylinderGeometry(20, 20, 3, 32);

var OIMOMesh = function(options, material) {
	this.mtx = new THREE.Matrix4();
  this.body = new OIMO.Body(options);
  this.mesh = new THREE.Mesh(geoBox, material);
  this.mesh.scale.set(options.size[0], options.size[1], options.size[2]);
  if (options.pos) {
    this.mesh.position.x = options.pos[0];
    this.mesh.position.y = options.pos[1];
    this.mesh.position.z = options.pos[2];
  }
}

OIMOMesh.prototype.update = function() {
	var m = this.body.body.getMatrix();
  this.mtx.fromArray(m);
  this.mesh.position.setFromMatrixPosition(this.mtx);
  this.mesh.rotation.setFromRotationMatrix(this.mtx);
};

var OIMOMeshC = function(options, material) {
	this.mtx = new THREE.Matrix4();
  this.body = new OIMO.Body(options);
  this.mesh = new THREE.Mesh(cylGeom, material);
  this.mesh.scale.set(options.size[0], options.size[1], options.size[2]);
  if (options.pos) {
    this.mesh.position.x = options.pos[0];
    this.mesh.position.y = options.pos[1];
    this.mesh.position.z = options.pos[2];
  }
  this.mesh.rotation.y = 1;
}

function init() {

    // three init
    renderer = new THREE.WebGLRenderer({
        precision: "mediump",
        antialias: false,
        clearColor: 0x585858,
        clearAlpha: 0
    });
    renderer.setClearColor(0x000, 1);
    renderer.setSize(window.innerWidth, window.innerHeight);

    container = document.getElementById("container");
    container.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 150, 300);
    center = new THREE.Vector3();
    camera.lookAt(center);
    controls = new THREE.OrbitControls( camera );
  
    scene = new THREE.Scene();

    scene.add( new THREE.AmbientLight( 0x383838 ) );

    light = new THREE.DirectionalLight(0xffffff, 1.3);
    light.position.set(0.3, 1, 0.5);
    scene.add(light);

    //add ground mesh
    var mat = new THREE.MeshLambertMaterial({
        color: 0x151515
    });
    
    var geo1 = new THREE.BoxGeometry(400, 50, 400);

    var mground1 = new THREE.Mesh(geo1, mat);
    mground1.position.y = -50;
    scene.add(mground1);

    geoSphere = new THREE.SphereGeometry(1, 20, 10);
    geoBox = new THREE.BoxGeometry(1, 1, 1);

    matSphere = new THREE.MeshLambertMaterial({
        map: basicTexture(0),
        name: 'sph'
    });
    matBox = new THREE.MeshLambertMaterial({
        map: basicTexture(2),
        name: 'box'
    });
    matSphereSleep = new THREE.MeshLambertMaterial({
        map: basicTexture(1),
        name: 'ssph'
    });
    matBoxSleep = new THREE.MeshLambertMaterial({
        map: basicTexture(3),
        name: 'sbox'
    });

    // oimo init
    world = new OIMO.World();
    populate(1);

    // loop
    setInterval(loop, 1000 / 60);

    // events
    window.addEventListener('resize', onWindowResize, false);

}

var myOM;
var myMesh, myBody;
function populate(n) {

    //var max = document.getElementById("MaxNumber").value;
    var max = 256;

    if (n === 1) {
        type = 1;
    } else if (n === 2) {
        type = 2;
    } else if (n === 3) {
        type = 3;
    }

    // reset old
    clearMesh();
    world.clear();

  
    myOM = new OIMOMesh({
			type: 'box',
			size: [398, 25, 200],
			pos: [0, 13, -184],
			config: [100, 0],
			move: true,
			world: world
		}, new THREE.MeshLambertMaterial({ color: "#FFFFFF" }));
          
              scene.add(myOM.mesh);

    var backboard = new OIMOMesh({
			type: 'box',
			size: [400, 400, 20],
			pos: [0, 226, -186],
			config: [100, 0, 1],
			move: false,
			world: world
		}, new THREE.MeshLambertMaterial({ color: "#FFFFFF" }));
          
              scene.add(backboard.mesh);

    var topshelf = new OIMOMesh({
			type: 'box',
			size: [400, 25, 500],
			pos: [0, -12, -156],
			config: [100, 0, 1],
			move: false,
			world: world
		}, new THREE.MeshLambertMaterial({ color: "#FFFFFF" }));
          
              scene.add(topshelf.mesh);

var mat = new THREE.MeshPhongMaterial( { color: 0x000000, shininess: 100 } );
    mat.transparent = true;
    mat.opacity = 0.3;
    mat.specular.setRGB( 1, 1, 1 );
    var glass = new OIMOMesh({
			type: 'box',
			size: [400, 330, 2],
			pos: [0, 226, -165],
			config: [100, 0, 1],
			move: false,
			world: world
		}, mat);
          
              scene.add(glass.mesh);

		var lSide = new OIMOMesh({
			type: 'box',
			size: [50, 50, 400],
			pos: [-225, 0, 0],
			config: [100, 0, 1],
			move: false,
			world: world
		}, new THREE.MeshLambertMaterial({ color: "#FFFFFF" }));
          
              scene.add(lSide.mesh);

              var rSide = new OIMOMesh({
			type: 'box',
			size: [50, 50, 400],
			pos: [225, 0, 0],
			config: [100, 0, 1],
			move: false,
			world: world
		}, new THREE.MeshLambertMaterial({ color: "#FFFFFF" }));
          
              scene.add(rSide.mesh);

    //add ground
    //    var ground = new OIMO.Body({size:[100, 40, 400], pos:[0,-20,0], world:world});
    var ground2 = new OIMO.Body({
        size: [400, 50, 400],
        pos: [0, -50, 0],
        world: world
    });

    //add object
    var w = 20;
    var h = 3;
    var d = 20;

    var color;
    var i;
    for (var x = 0; x < 120; x++) {
        i = x;
        color = "#FF0000";
        y = 0;
        bodys[i] = new OIMO.Body({
            type: 'box',
            size: [w, h, d],
            pos: [Math.random()*400-200, y * DOT_SIZE + 50, Math.random()*400-200],
            move: true,
            config: [1],
            world: world
        });
        var material = new THREE.MeshLambertMaterial({
            color: color
        });
        meshs[i] = new THREE.Mesh(geoBox, material);
        meshs[i].scale.set(w, h, d);
        scene.add(meshs[i]);
    }
    
}

function clearMesh() {
    var i = meshs.length;
    while (i--) {
        scene.remove(meshs[i]);
    }
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// MAIN LOOP

addEventListener("keydown", function(e) {
	if (e.keyCode == 32) {
		var coin = new OIMOMeshC({
					type: 'cylinder',
					size: [1, 1, 1],
					//pos: [Math.random()*400-200, 226, -170],
                    pos: [Math.random()*400-200, 226, -120],
					move: true,
					world: world
				}, new THREE.MeshLambertMaterial({ color: "#FF0000" }));
        coin.mesh.rotation.x = 45;
              scene.add(coin.mesh);
              meshs.push(coin.mesh);
              bodys.push(coin.body);
	}
})
var score= 0;
function loop() {
  myBody = myOM.body;
myMesh = myOM.mesh;
    if (myBody.body.linearVelocity.z >= 0 && myBody.body.position.z < -1.1) {
      if (myBody.body.linearVelocity.z < 0.6) {
       myBody.body.linearVelocity.z += 0.08;
      }
      //myBody.body.position.z += 0.03;
    } else if (myOM.body.body.position.z > -1.85) {
      if (myBody.body.linearVelocity.z > 0) myBody.body.linearVelocity.z = 0;
      if (myBody.body.linearVelocity.z > -0.6) {
       myBody.body.linearVelocity.z -= 0.08;
      }
      //myBody.body.position.z -= 0.03;
    } else {
      myBody.body.linearVelocity.z = 0;
      count = 0;
    }
    
    world.step();

    var p, r, m, x, y, z;
    var mtx = new THREE.Matrix4();
    var i = bodys.length;
    var mesh;

    myOM.update();

    while (i--) {
        var body = bodys[i].body;
        mesh = meshs[i];

        if (!body.sleeping) {
            m = body.getMatrix();
            mtx.fromArray(m);
            mesh.position.setFromMatrixPosition(mtx);
            mesh.rotation.setFromRotationMatrix(mtx);
        }
        if (body.position.y < -5 && !body.counted) {
        	console.log("Score: ", ++score);
        	body.counted = true;
        }
    }

		controls.update();
    renderer.render(scene, camera);
}




// TEXTURE
function basicTexture(n) {
    var canvas = document.createElement('canvas');
    canvas.width = canvas.height = 64;
    var ctx = canvas.getContext('2d');
    var colors = [];
    if (n === 0) { // sphere
        colors[0] = "#58AA80";
        colors[1] = "#58FFAA";
    }
    if (n === 1) { // sphere sleep
        colors[0] = "#383838";
        colors[1] = "#38AA80";
    }
    if (n === 2) { // box
        colors[0] = "#AA8058";
        colors[1] = "#FFAA58";
    }
    if (n === 3) { // box sleep
        colors[0] = "#383838";
        colors[1] = "#AA8038";
    }
    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = colors[1];
    ctx.fillRect(0, 0, 32, 32);
    ctx.fillRect(32, 32, 32, 32);

    var tx = new THREE.Texture(canvas);
    tx.needsUpdate = true;
    return tx;
}

// MATH

init();
