//File Contains Game Related Elements and functions
//important game objects
var camera, scene, renderer;
var geometry, material, fighter;
var objects, keyboard, light, lightTrack
var prevTime, testFighter1, testFighter2

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

					if(this.otherPlayers[e].id == world.players[p].id && this.otherPlayers[e].timeStamp < world.players[p].timeStamp){
						
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
						this.otherPlayers[e].timeStamp = world.players[p].timeStamp


					}
				}
				
			}

			else{
				this.playerIds.push(world.players[p].id)
				var material = new THREE.MeshPhongMaterial( {
					color: Math.random()*0xffffff, 
					specular: 0xffffff,
					polygonOffset: true,
		    		polygonOffsetFactor: 1, // positive value pushes polygon further away
		    		polygonOffsetUnits: 1

				} );
				var geometry = createFighterGeometry(1)//new THREE.BoxGeometry(1,1,1 );
				enemy = new THREE.Mesh( geometry, material );
				enemy.position.x = world.players[p].location.x
				enemy.position.y = world.players[p].location.y
				enemy.position.z = world.players[p].location.z
				enemy.rotation.x = world.players[p].rotation.x
				enemy.rotation.y = world.players[p].rotation.y
				enemy.rotation.z = world.players[p].rotation.z
				var enemyObj = {"id":world.players[p].id,"timeStamp":world.players[p].timeStamp, "mesh":enemy,"vel":new THREE.Vector3(world.players[p].vel.x,world.players[p].vel.y,world.players[p].vel.z),"rotVel":new THREE.Vector3(world.players[p].rotVel.x,world.players[p].rotVel.y,world.players[p].rotVel.z)}
				this.otherPlayers.push(enemyObj)
				scene.add(enemy)

				var geo = new THREE.EdgesGeometry( enemy.geometry ); // or WireframeGeometry
				var mat = new THREE.LineBasicMaterial( { color: 0x0000000, linewidth: 1 } );
				var enemyWF = new THREE.LineSegments( geo, mat );
				enemy.add(enemyWF)

			}
		}
	}
}

//GEOMETRIES
function createFighterGeometry(s){
	var geometry = new THREE.Geometry()
	geometry.vertices.push(
		new THREE.Vector3(0,0,0),//0
		new THREE.Vector3(.5*s,   0,      .5*s),//1
		new THREE.Vector3(.5*s,   0,      1*s),//2
		new THREE.Vector3(0,       .25*s,  .5*s),//
		new THREE.Vector3(0,       0*s,   .75*s),
		new THREE.Vector3(-.5*s,    0,      .5*s),
		new THREE.Vector3(-.5*s,    0,      1*s)

	)
	var normal = new THREE.Vector3( 0, -1, 0 );
	var normal2 = new THREE.Vector3( 0, 1, 0 );

	var color = new THREE.Color( 0x000000 );
	geometry.faces.push( 
		new THREE.Face3( 0, 1, 3,normal,0xffffff*Math.random() ) ,
		new THREE.Face3( 3, 1, 4,normal,0xffffff*Math.random() ) ,
		new THREE.Face3( 1, 2, 4,normal,0xffffff*Math.random() ) ,
		new THREE.Face3( 0, 3, 5,normal,0xffffff*Math.random() ) ,
		new THREE.Face3( 5, 3, 4,normal,0xffffff*Math.random() ) ,
		new THREE.Face3( 4, 6, 5,normal,0xffffff*Math.random() ) ,
		new THREE.Face3( 3, 1, 0,normal2,0xffffff*Math.random() ) ,
		new THREE.Face3( 4, 1, 3,normal2,0xffffff*Math.random() ) ,
		new THREE.Face3( 4, 2, 1,normal2,0xffffff*Math.random() ) ,
		new THREE.Face3( 5, 3, 0,normal2,0xffffff*Math.random() ) ,
		new THREE.Face3( 4, 3, 5,normal2,0xffffff*Math.random() ) ,
		new THREE.Face3( 5, 6, 4,normal2,0xffffff*Math.random() ) 

	);
	return geometry
}

function createAsteroidGeometry(s){
	var geometry = new THREE.SphereGeometry( s, 6, 6 );
	for(var i = 0; i< geometry.vertices.length; i++){
		if(Math.random() > .5){
			geometry.vertices[i].multiplyScalar(Math.random()/2+1)
		}
	}
	return geometry

}


//MATERIALS
function createFighterMaterial(c){
	var mat = new THREE.MeshPhongMaterial( 
		{ 	color: c, 
			specular: 0xffffff,
			polygonOffset: true,
    		polygonOffsetFactor: 1, // positive value pushes polygon further away
    		polygonOffsetUnits: 1
    	} 
    );
    return mat
}
function createAsteroidMaterial(c){

}

//WIREFRAME
function createWireFrame(g){
	//WF
	var geo = new THREE.EdgesGeometry( g ); // or WireframeGeometry
	var mat = new THREE.LineBasicMaterial( { color: 0x0000000, linewidth: 1 } );
	var wf = new THREE.LineSegments( geo, mat );
	return wf
}

function init() {
	prevTime = 0

	keyboard = new Keyboard()

	camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 100 );
	
	scene = new THREE.Scene();
	scene.background = new THREE.Color( 0x8a8a8a );

	var ambLight = new THREE.AmbientLight( 0x909090 );//ambient game light
	scene.add( ambLight );


	light = new THREE.PointLight( 0xffffff, 1, 100 );//rotating temp point light
	scene.add( light );
	// var sphereSize = 1;
	// var pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
	// scene.add( pointLightHelper );


	fighterMaterial = createFighterMaterial(0x88bb88)
    geometry = createFighterGeometry(1)//new THREE.BoxGeometry(1,1, 1 );
    fighter = new THREE.Mesh( geometry, fighterMaterial );
    scene.add( fighter );
	objects = new sceneObjects(fighter)

	

	//create dummy fighter 1
	testFighter1Mat = createFighterMaterial(0x88bb88)
	testFighter1Geo = createFighterGeometry(1)//new THREE.BoxGeometry(1,1,1);
	testFighter1 = new THREE.Mesh(testFighter1Geo,testFighter1Mat)
	testFighter1.position.z=-3
	var wireframe1 = createWireFrame(testFighter1.geometry)
	testFighter1.add(wireframe1)
	scene.add(testFighter1)

	//create dummy fighter 2
	testFighter2Mat = createFighterMaterial(0x8b8cdd)
	testFighter2Geo = createFighterGeometry(1)//new THREE.BoxGeometry(1,1,1);
	testFighter2 = new THREE.Mesh(testFighter2Geo,testFighter2Mat)
	testFighter2.position.z=-3
	testFighter2.position.x=2
	var wireframe2 = createWireFrame(testFighter2.geometry)
	testFighter2.add(wireframe2)
	scene.add(testFighter2)



	for(var a = 0; a<20*Math.random()+40; a++){
		var astG = createAsteroidGeometry(2)
		var astM = new THREE.MeshPhongMaterial( 
			{ 	color: 0xffffff*Math.random(), 
				specular: 0x111122,
				polygonOffset: true,
	    		polygonOffsetFactor: 1, // positive value pushes polygon further away
	    		polygonOffsetUnits: 1,
	    		shininess:0
    		} 
    	);
    	var astWFGeo = new THREE.EdgesGeometry( astG ); // or WireframeGeometry
		var astWFMat = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 1 , opacity:.5, transparent:true} );
    	var wfAst = new THREE.LineSegments( astWFGeo, astWFMat );
    	var ast = new THREE.Mesh(astG,astM)
    	ast.position.x = (Math.random()-.5)*100
    	ast.position.y =(Math.random()-.5)*100
    	ast.position.z = (Math.random()-.5)*100
    	scene.add(ast)
    	ast.add(wfAst)


	}


	var canvasElem = document.getElementById("gameCanvas")
	renderer = new THREE.WebGLRenderer( { antialias: true, canvas: canvasElem } );
	renderer.setSize( window.innerWidth, window.innerHeight );
	//document.body.appendChild( renderer.domElement );			
	//window.setInterval(tick, 1)
	requestAnimationFrame(animate)

	
}

var prevTimeLoop = 0
function gameLoop(){
	if(prevTimeLoop == 0){
		prevTimeLoop = (new Date()).getTime()
	}
	objects.refreshWorld()
	
	if (document.hidden == true) {//turn off keyboard controls while page is hidden
		console.log("erasing")
    	keyboard.reset()
	}
	var timeLoop = (new Date()).getTime()
	var dtLoop = timeLoop-prevTimeLoop
	prevTimeLoop = timeLoop
	playerMovement(dtLoop)


}



function playerMovement(dt){

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
	if(keyboard.keysDown.indexOf("¿") > -1){//rotation around z axis: roll
		rotation.z++
	}
	if(keyboard.keysDown.indexOf(16) > -1){
		rotation.z--
	}
	//_______________________________________

	movement.normalize()
	rotation.normalize()

	//Translate movement from fighter to world space
	movement.transformDirection(objects.fighter.mesh.matrixWorld)



	//Add desired movement as a velocity
	//Constants of movement and rotation
	var acceleration = .02
	var rotationalAcceleration = .05
	var maxSpeed = 6
	var maxRotSpeed = 2

	movement.multiplyScalar(acceleration*dt/16) //dt/16 represents dt/60fps 
	rotation.multiplyScalar(rotationalAcceleration*dt/16)
	objects.fighter.vel.add(movement)
	objects.fighter.rotVel.add(rotation)
	
	objects.fighter.vel.clampLength(-maxSpeed,maxSpeed)
	objects.fighter.rotVel.clampLength(-maxRotSpeed, maxRotSpeed)


}
function tick(){


}
function animate( time ) {
	// objects.refreshWorld()
	requestAnimationFrame(animate)

	dt = (time - prevTime)/1000

	// fighter.rotation.x = time * 0.0005;
	// fighter.rotation.y = time * 0.001;
	
	//Move The Fighter
	dMove = new THREE.Vector3()
	dMove.copy(objects.fighter.vel)
	dMove.multiplyScalar(dt)
	objects.fighter.mesh.position.add(dMove)
	//Rotate The Fighter
	dRot = new THREE.Vector3()
	dRot.copy(objects.fighter.rotVel)
	dRot.multiplyScalar(dt)
	objects.fighter.mesh.rotateX(dRot.x)
	objects.fighter.mesh.rotateY(dRot.y)
	objects.fighter.mesh.rotateZ(dRot.z)

	
	


	//move camera to fighter position and rotation
	camera.rotation.x = objects.fighter.mesh.rotation.x
	camera.rotation.y = objects.fighter.mesh.rotation.y
	camera.rotation.z = objects.fighter.mesh.rotation.z
	camera.position.x = objects.fighter.mesh.position.x
	camera.position.y = objects.fighter.mesh.position.y
	camera.position.z = objects.fighter.mesh.position.z

	//calculate and implement rotational decay
	var rotationalDecay = Math.pow(1.02, 1000 * dt / 16)
	objects.fighter.rotVel.divideScalar(rotationalDecay)

	//dummies
	// testFighter1.rotation.y += .007
	// testFighter1.position.x = -Math.sin(time/1000)
	// testFighter1.position.z = -Math.cos(time/1000)
	var dummyMove = new THREE.Vector3(0,0,-1)
	//var dummyRot = new THREE.Vector3(0,Math.sin(time/10000),0)
	dummyMove.normalize()
	dummyMove.transformDirection(testFighter1.matrixWorld)
	testFighter1.position.x += dummyMove.x /100
	testFighter1.position.y += dummyMove.y /100
	testFighter1.position.z += dummyMove.z /100
	testFighter1.rotation.y = Math.cos(time/5000/1)*Math.PI
	testFighter1.rotation.x = Math.sin(time/5000/1)

	dummyMove2 = new THREE.Vector3(0,0,-1)
	dummyMove2.transformDirection(testFighter2.matrixWorld)

	testFighter2.position.x += dummyMove2.x /100
	testFighter2.position.y += dummyMove2.y /100
	testFighter2.position.z += dummyMove2.z /100
	testFighter2.rotation.y = Math.cos(time/5000/1)*Math.PI




	

	//move For Other players
	for(var e = 0; e< objects.otherPlayers.length; e++){
		var v = new THREE.Vector3()
		v.copy(objects.otherPlayers[e].vel)
		
		

		vR = new THREE.Vector3()
		vR.copy(objects.otherPlayers[e].rotVel)

		
		v.multiplyScalar(dt)
		vR.multiplyScalar(dt)

		
		objects.otherPlayers[e].mesh.position.add(v)
		
	
		objects.otherPlayers[e].mesh.rotateX(vR.x)
		objects.otherPlayers[e].mesh.rotateY(vR.y)
		objects.otherPlayers[e].mesh.rotateZ(vR.z)
		objects.otherPlayers[e].rotVel.divideScalar(rotationalDecay)

	}



	sendData()//send player data to server
	renderer.render( scene, camera );
	prevTime = time
	gameLoop()

}



function Keyboard(){
	this.keysDown = [];
	var keys = this.keysDown
	this.prevTime = new Date();
	this.reset = function(){
		this.keysDown = []
		keys = []
		keys = this.keysDown

	}
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
	socket.emit(
		"playerData",{
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


