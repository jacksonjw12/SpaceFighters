//File Contains Server Connection Functions and Main Function

var socket
var name, id, playerLocation
var world = {"name":"none","players":[]}
function main(){
	setSockets()
	
}

function startGame(){//assure game data is set first
	init()
	requestAnimationFrame( animate );
}
function ready(){
	window.setTimeout(gameLoop,30)


}
function setSockets(){
	socket = io()


	socket.on('connectionToRoom', function(data){
		console.log(123)
		id = data.id
		world = data.world
		playerLocation = data.location
		console.log(world)
		console.log("connected")
		startGame()

	})
	// socket.on("newPlayer", function(data){
	// 	if(data.player.id == id){//prevent adding yourself!
	// 		return;
	// 	}
	// 	world.players.push(data.player)
	// 	console.log(world)

	// })
	socket.on("worldRefresh", function(data){
		world = data.world

		//console.log(world)
		
	})
	socket.emit('connectPlayer', {"name":name})



}


function enterName(){
	name = document.getElementById("playerName").value
	if(name == ""){return;}
	main();
	 document.getElementById("formLocation").hidden = true

}
function post(domain, obj, callback) {
	$.ajax({
		url: domain,
		type: "POST",
		data: JSON.stringify(obj),
		cache: false,
		dataType: "json",
		contentType: "application/json"
	}).done(function (data) {
		callback(data);
	}).fail(function () {
		console.error("Error reading file at '" + domain + "'.");
	});
}