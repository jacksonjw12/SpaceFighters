//File Contains Game Related Elements and functions

var camera, scene, renderer;
var geometry, material, fighter;
var objects, keyboard
var prevTime

function sceneObjects(fMesh){
	//Fighter is the player controlled object
	this.fighter = {}
	this.fighter.vel = new THREE.Vector3(0,0,0)
	this.fighter.rotVel = new THREE.Vector3(0,0,0)
	fMesh.position.x = playerLocation.x//set position to location initially returned by server
	fMesh.position.y = playerLocation.y
	fMesh.position.z = playerLocation.z
	this.fighter.mesh = fMesh//mesh contains position and velocity elements

	this.otherPlayers = []
	this.playerIds = []
	
	this.refreshWorld = function(){//run to convert world to sceneObjects
		for(var p = 0; p< world.players.length; p++){
			if(world.players[p].id == id){
				
			}
			else if(this.playerIds.indexOf(world.players[p].id) > -1){
				for(var e = 0; e<this.otherPlayers.length; e++){
					if(this.otherPlayers[e].id == world.players[p].id){
						this.otherPlayers[e].mesh.position.x = world.players[p].location.x
						this.otherPlayers[e].mesh.position.y = world.players[p].location.y
						this.otherPlayers[e].mesh.position.z = world.players[p].location.z
						this.otherPlayers[e].mesh.rotation.x = world.players[p].rotation.x
						this.otherPlayers[e].mesh.rotation.y = world.players[p].rotation.y
						this.otherPlayers[e].mesh.rotation.z = world.players[p].rotation.z
						this.otherPlayers[e].vel.x = world.players[p].vel.x
						this.otherPlayers[e].vel.y = world.players[p].vel.y
						this.otherPlayers[e].vel.z = world.players[p].vel.z
						this.otherPlayers[e].rotVel.x = world.players[p].rotVel.x
						this.otherPlayers[e].rotVel.y = world.players[p].rotVel.y
						this.otherPlayers[e].rotVel.z = world.players[p].rotVel.z

					}
				}
				
			}

			else{
				this.playerIds.push(world.players[p].id)
				var material = new THREE.MeshPhongMaterial( { color: Math.random()*0xffffff, specular: 0xffffff, wireframe:false } );
				var geometry = new THREE.BoxGeometry(1,1,1 );
				enemy = new THREE.Mesh( geometry, material );
				enemy.position.x = world.players[p].location.x
				enemy.position.y = world.players[p].location.y
				enemy.position.z = world.players[p].location.z
				enemy.rotation.x = world.players[p].rotation.x
				enemy.rotation.y = world.players[p].rotation.y
				enemy.rotation.z = world.players[p].rotation.z
				var enemyObj = {"mesh":enemy,"vel":new THREE.Vector3(world.players[p].vel.x,world.players[p].vel.y,world.players[p].vel.z),"rotVel":new THREE.Vector3(world.players[p].rotVel.x,world.players[p].rotVel.y,world.players[p].rotVel.z)}
				this.otherPlayers.push(enemyObj)
				scene.add(enemy)
			}
		}
	}
}


function init() {
	prevTime = 0

	keyboard = new Keyboard()


	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 100 );
	//camera.position.z = -10;
	//camera.position.y = 1
	//camera.rotation.y = Math.PI

	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x8a8a8a );

	var light = new THREE.HemisphereLight( 0xffffff, 0x000000, 1 );
	scene.add( light );

	materialWire = new THREE.MeshPhongMaterial( { color: 0x88bb88, specular: 0xffffff, wireframe:true } );
	geometry = new THREE.BoxGeometry(1,1, 1 );
	fighter = new THREE.Mesh( geometry, materialWire );
	scene.add( fighter );
	objects = new sceneObjects(fighter)

	material = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff, wireframe:false } );

	asteroidGeo = new THREE.BoxGeometry(1,1,1);
	ast1 = new THREE.Mesh(asteroidGeo,material)
	ast1.position.z=-3
	scene.add(ast1)

	material = new THREE.MeshPhongMaterial( { color: 0x00ff00, specular: 0xffffff, wireframe:false } );

	ast2= new THREE.Mesh(asteroidGeo,material)
	ast2.position.z=-3
	ast2.position.x = 2
	scene.add(ast2)
	



	renderer = new THREE.WebGLRenderer( { antialias: true } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );				
}
function playerMovement(){

	//Turn Players Keyboard entries into desired movements and rotations
	//______________________________________
	//console.log(keyboard.keysDown)
	var movement = new THREE.Vector3(0,0,0)
	var rotation = new THREE.Vector3(0,0,0)
	if(keyboard.keysDown.indexOf("Q") > -1){
		movement.y++;
	}
	if(keyboard.keysDown.indexOf("E") > -1){
		movement.y--;
	}
	if(keyboard.keysDown.indexOf("W") > -1){
		movement.z--;
	}
	if(keyboard.keysDown.indexOf("S") > -1){
		movement.z++;
	}
	if(keyboard.keysDown.indexOf("A") > -1){
		movement.x--;
	}
	if(keyboard.keysDown.indexOf("D") > -1){
		movement.x++;
	}
	if(keyboard.keysDown.indexOf("&") > -1){//rotation around x axis: pitch
		rotation.x++;
	}
	if(keyboard.keysDown.indexOf("(") > -1){
		rotation.x--;
	}
	if(keyboard.keysDown.indexOf("%") > -1){//rotation around y axis: yaw
		rotation.y++
	}
	if(keyboard.keysDown.indexOf("'") > -1){
		rotation.y--
	}
	if(keyboard.keysDown.indexOf("¿") > -1){//rotation around y axis: yaw
		rotation.z++
	}
	if(keyboard.keysDown.indexOf(16) > -1){
		rotation.z--
	}
	//may add roll here so rotation around z axis
	//_______________________________________

	movement.normalize()
	rotation.normalize()

	//Translate movement from fighter to world space
	 // movement.applyAxisAngle(new THREE.Vector3(1,0,0), objects.fighter.mesh.rotation.x)
	 // movement.applyAxisAngle(new THREE.Vector3(0,1,0), objects.fighter.mesh.rotation.y)
	 // movement.applyAxisAngle(new THREE.Vector3(0,0,1), objects.fighter.mesh.rotation.z)
	movement.transformDirection(objects.fighter.mesh.matrixWorld)



	//Add desired movement as a velocity
	//Constants of movement and rotation
	var acceleration = .05
	var rotationalAcceleration = .05
	var maxSpeed = 5
	var maxRotSpeed = 2

	movement.multiplyScalar(acceleration)
	rotation.multiplyScalar(rotationalAcceleration)
	objects.fighter.vel.add(movement)
	objects.fighter.rotVel.add(rotation)
	
	objects.fighter.vel.clampLength(-maxSpeed,maxSpeed)
	objects.fighter.rotVel.clampLength(-maxRotSpeed, maxRotSpeed)



}

function animate( time ) {
	objects.refreshWorld()
	//console.log(world)

	dt = (time - prevTime)/1000
	requestAnimationFrame( animate );

	// fighter.rotation.x = time * 0.0005;
	// fighter.rotation.y = time * 0.001;
	playerMovement()
	
	//Move The Fighter
	dMove = new THREE.Vector3()
	dMove.copy(objects.fighter.vel)
	dMove.multiplyScalar(dt)
	objects.fighter.mesh.position.add(dMove)
	//Rotate The Fighter
	dRot = new THREE.Vector3()
	dRot.copy(objects.fighter.rotVel)
	dRot.multiplyScalar(dt)


	//objects.fighter.mesh.rotation.x+= dRot.x//(dRot)
	//objects.fighter.mesh.rotation.y+= dRot.y//(dRot)
	//console.log(dRot)
	//var looking = new THREE.Vector3(dRot.x,dRot.y)
	// objects.fighter.mesh.translateX(dMove.x)
	// objects.fighter.mesh.translateY(dMove.y)
	// objects.fighter.mesh.translateZ(dMove.z)

	objects.fighter.mesh.rotateX(dRot.x)
	objects.fighter.mesh.rotateY(dRot.y)
	objects.fighter.mesh.rotateZ(dRot.z)


	camera.rotation.x = objects.fighter.mesh.rotation.x
	camera.rotation.y = objects.fighter.mesh.rotation.y
	camera.rotation.z = objects.fighter.mesh.rotation.z
	camera.position.x = objects.fighter.mesh.position.x
	camera.position.y = objects.fighter.mesh.position.y
	camera.position.z = objects.fighter.mesh.position.z

	//console.log(objects.fighter.mesh.rotation)

	// objects.fighter.mesh.rotation.applyAxisAngle(new THREE.Vector3(1,0,0), objects.fi)
	// pitchAxis = new Three.Vector3()
	// pitchAxis.copy(objects.fighter.mesh.rotation)
	// pitchAxis.applyAxisAngle()
	// yawAxis = new Three.Vector3()
	// yawAxis.copy(objects.fighter.mesh.rotation)

	var rotationalDecay = Math.pow(1.02, 1000 * dt / 16)
	objects.fighter.rotVel.divideScalar(rotationalDecay)


	//move For Other players
	for(var e = 0; e< objects.otherPlayers.length; e++){
		var v = new THREE.Vector3()
		v.copy(objects.otherPlayers[e].vel)
		v.multiplyScalar(dt)
		objects.otherPlayers[e].mesh.position.add(v)

		vR = new THREE.Vector3()
		vR.copy(objects.otherPlayers[e].rotVel)
		vR.multiplyScalar(dt)
	
		objects.otherPlayers[e].mesh.rotateX(vR.x)
		objects.otherPlayers[e].mesh.rotateY(vR.y)
		objects.otherPlayers[e].mesh.rotateZ(vR.z)
		objects.otherPlayers[e].rotVel.divideScalar(rotationalDecay)

	}



	sendData()
	renderer.render( scene, camera );
	prevTime = time

}



function Keyboard(){
	this.keysDown = [];
	var keys = this.keysDown
	this.prevTime = new Date();
	document.addEventListener('keydown', function(event){
	
		
		
		if(event.keyCode > 31){
			var keyChar = String.fromCharCode(event.keyCode);
			if(keys.indexOf(keyChar) == -1){
				keys.push(keyChar);
			}
		}
		else{
			
			if(keys.indexOf(event.keyCode) == -1){
				keys.push(event.keyCode);
			}
		}
		


		});

	document.addEventListener('keyup', function(event){
		
		if(event.keyCode > 31){
			var keyChar = String.fromCharCode(event.keyCode);

			if(keys.indexOf(keyChar) > -1){
				keys.splice(keys.indexOf(keyChar),1);
			}
		}
		else{

			if(keys.indexOf(event.keyCode) > -1){
				keys.splice(keys.indexOf(event.keyCode),1);
			}
		}

	})



}
function sendData(){
	socket.emit("playerData",{
				"id":id,
				"x":objects.fighter.mesh.position.x,
				"y":objects.fighter.mesh.position.y,
				"z":objects.fighter.mesh.position.z,
				"rotX":objects.fighter.mesh.rotation.x,
				"rotY":objects.fighter.mesh.rotation.y,
				"rotZ":objects.fighter.mesh.rotation.z,
				"velX":objects.fighter.vel.x,
				"velY":objects.fighter.vel.y,
				"velZ":objects.fighter.vel.z,
				"rotVelX":objects.fighter.rotVel.x,
				"rotVelY":objects.fighter.rotVel.y,
				"rotVelZ":objects.fighter.rotVel.z
				})
	

}


