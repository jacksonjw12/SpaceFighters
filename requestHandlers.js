var io
var world = {
	"name":"room1",
	"players":[
	// {
	// 	"id":"000022",
	// 	"socket":123,
	// 	"name":"jack"
		//Location:xyz
	//later include private id only server and client know
	// }

	]
	
}
var ids = []
function makeId(s) {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < s; i++)
	text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function getId(){
	for(var c = 0; c<100;c++){
		var i = makeId(5)
		if(ids.indexOf(i) < 0){
			ids.push(i)
			return i
		}

	}
	return "0"
}
function getPlayerVisibleWorld(){
	w = {}
	w.name = world.name
	w.players = []
	for(var p = 0; p< world.players.length; p++){
		var wp = {}
		wp.id = world.players[p].id
		wp.name = world.players[p].name
		wp.location = world.players[p].location
		w.players.push(wp)
	}
	return w

}

function initializeSockets(server){
 	io = require('socket.io')(server);
 	io.on('connection', function (socket) {
 		socket.on('connectPlayer', function(data){
 			socket.join("room1")
 			var p = {}
 			p.id = getId()
 			p.name = data.name
 			p.socket = socket
 			p.location = {"x":0,"y":0,"z":0}


 			world.players.push(p)
 			socket.emit("connectionToRoom",{"id":p.id,"location":p.location,"world":getPlayerVisibleWorld()})
 			io.to("room1").emit("worldRefresh",{"world":getPlayerVisibleWorld()})

 			console.log(p)

 			console.log(world)
 		})

 		socket.on("location", function(data){
 			for(var p = 0; p<world.players.length; p++){
 				if(world.players[p].id == data.id){
 					world.players[p].location.x = data.x
 					world.players[p].location.y = data.y
 					world.players[p].location.z = data.z
 					break;
 				}
 			}
 			socket.emit("worldRefresh",{"world":getPlayerVisibleWorld()})
 		})
 		
 	})
		
		
 }





// function listRooms(req, res){
// 	var rooms = []
// 	for(w in worlds){
// 		world = worlds[w]
// 		rooms.push({"name":world.name,"players":world.players.length})
// 	}
// 	res.send({"roomList":rooms});
// }


var exports;
// exports.test = test;
//exports.listRooms = listRooms;
exports.initializeSockets = initializeSockets;