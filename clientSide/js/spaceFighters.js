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
						this.otherPlayers[e].position.x = world.players[p].location.x
						this.otherPlayers[e].position.y = world.players[p].location.y
						this.otherPlayers[e].position.z = world.players[p].location.z
					}
				}
				
			}

			else{
				this.playerIds.push(world.players[p].id)
				var material = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff, wireframe:false } );
				var geometry = new THREE.BoxGeometry(1,1,1 );
				enemy = new THREE.Mesh( geometry, material );
				enemy.position.x = world.players[p].location.x
				enemy.position.y = world.players[p].location.y
				enemy.position.z = world.players[p].location.z
				this.otherPlayers.push(enemy)
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
	var rotationalDecay = 1.02

	movement.multiplyScalar(acceleration)
	rotation.multiplyScalar(rotationalAcceleration)
	objects.fighter.vel.add(movement)
	objects.fighter.rotVel.add(rotation)
	objects.fighter.rotVel.divideScalar(rotationalDecay)
	
	objects.fighter.vel.clampLength(-maxSpeed,maxSpeed)
	objects.fighter.rotVel.clampLength(-maxRotSpeed, maxRotSpeed)



}

function animate( time ) {
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




	socket.emit("location",{"id":id,"x":objects.fighter.mesh.position.x, "y":objects.fighter.mesh.position.y,"z":objects.fighter.mesh.position.z})
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
	
	
	// this.rotWay = 1;
	// camera.vel = new point3d(0,0,0)
	// this.doMovement = function(camera){
	// 	var dC = new Date();
	// 	var dt = dC-this.prevTime
		
		
	// 	var rotSp =.05
	// 	var movement = new point3d(0,0,0)
	// 	if(this.keysDown.indexOf("Q") > -1){
	// 		//camera.position.z+=10;
	// 		movement.y++;

	// 	}
	// 	if(this.keysDown.indexOf("E") > -1){
	// 		//camera.position.z-=10;
	// 		movement.y--;

	// 	}

	// 	if(this.keysDown.indexOf("W") > -1){
	// 		//camera.position.y+=10;
	// 		movement.z++;

	// 	}

	// 	if(this.keysDown.indexOf("S") > -1){
	// 		//camera.position.y-=10;
	// 		movement.z--;
	// 	}
	// 	if(this.keysDown.indexOf("A") > -1){
	// 		//camera.position.x+=10;
	// 		movement.x--;
	// 	}
	// 	if(this.keysDown.indexOf("D") > -1){
	// 		//camera.position.x-=10;
	// 		movement.x++;
	// 	}
	// 	var prevRot = camera.rotation.copyScale(1);
	// 	if(this.keysDown.indexOf("&") > -1){
	// 		camera.rotation.x-=.05*rotSp;
			
	// 	}
	// 	if(this.keysDown.indexOf("(") > -1){
	// 		camera.rotation.x+=.05*rotSp;
			
	// 	}
	// 	if(this.keysDown.indexOf("%") > -1){
	// 		camera.rotation.y-=.05*rotSp * this.rotWay;
			
	// 	}
	// 	if(this.keysDown.indexOf("'") > -1){
	// 		camera.rotation.y+=.05*rotSp * this.rotWay;
			
	// 	}
	// 	if(this.keysDown.indexOf(" ") > -1 && camera.stepsSinceBullet > 70){
	// 		camera.stepsSinceBullet = 0;
	// 		spawnBullet();
	// 	}
	
	// 	camera.rotVel.add( camera.rotation.vectorTo(prevRot));

	// 	//console.log(this.keysDown)

	// 	movement.normalize();
	// 	var speed = .8

	// 	var forward = camera.forward();
	// 	var left = camera.left();
	// 	var up = camera.up();
	// 	forward.normalize();
	// 	left.normalize();
	// 	up.normalize();
	// 	var deltaf = forward//.scale(movement.x)
	// 	deltaf.scale(speed*movement.z/10)
		
	// 	var deltal = left
	// 	deltal.scale(speed*movement.x/20)
		
	// 	var deltau = up
	// 	deltau.scale(speed*movement.y/20)

	// 	deltaf.add(deltau)
	// 	deltaf.add(deltal)
	// 	deltaf.scale(1/10)

	// 	var moveSpeed = 60;
	// 	camera.vel.add( deltaf )
		
	// 	camera.rotation = prevRot;
		
	// 	camera.position.add(camera.vel.copyScale(dt/1000*moveSpeed))
	// 	//camera.position.add(new point3d(camera.rotation.x,camera.rotation));
	// 	//camera.vel = camera.vel.copyScale(1000/30*moveSpeed)
	// 	camera.vel.scale(.99)
	// 	camera.rotVel.cap(.04);
	// 	camera.rotation.add(camera.rotVel.copyScale(dt/30))
	// 	camera.rotVel.scale(.99)
	// 	this.prevTime = dC

		

	// }




}
