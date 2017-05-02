
const socket = new WebSocket('ws://localhost:' + config["websocket-port"]);

var isPrinting = false;

socket.addEventListener('open', function (event) {
	console.log("connect websocket server success")
});
var tasks = [];

function addTask(task) {
	tasks.push(task);
}

function printTasks() {
	if (!isPrinting) {
		var task = tasks.shift();
		if (task) {
			printTask(task);
		}
	}
	setTimeout(printTasks, 500);
}
printTasks();

function printTask(task) {
	isPrinting = true;
	try{
		var plugin = require("./plugins/" + task.Name).default;
	}catch(ex){
		alert(ex.message);
		isPrinting = false;
		return;
	}
	document.getElementById("root").innerHTML = plugin(task.Data);
	window.print();
	isPrinting = false;
}

socket.addEventListener('message', function (event) {
	let task = JSON.parse(event.data);
	addTask(task);
});

function getPrintTask() {
	socket.send("get");
	setTimeout(getPrintTask, 500);
}

socket.addEventListener('open', function (event) {
	getPrintTask();
});





