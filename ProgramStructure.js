
var Callbacks = require("util/Callbacks");
//require("util");
function ProgramStructure(instructions, overrides, settings) { //instructions element is {n:name, d:default}

	this.callbacks = new Callbacks();
	this.nameList = [];
	//util.log(JSON.stringify(instructions));
	for (var i of instructions){
		var name = i.n;
		var Def = i.d;
		if (overrides && overrides[name]) {
			//util.log("giving gameStruture the custom: "+name);
			this[name] = overrides[name];
		} else {
			//util.log("giving gameStruture the default: "+name);
			this[name] = new Def(settings);
		}
		this.nameList.push(name);
	}

	for (var index in instructions) {
		if (instructions.hasOwnProperty(index)) {
			//util.log("index: "+index+" value: "+JSON.stringify(instructions[index]));
		var previ = instructions[parseInt(index)-1];
		var prev = previ ? previ.n : undefined;
		var nexti = instructions[parseInt(index)+1];
		var next = nexti ? nexti.n : undefined;

		var n = instructions[index].n;
		if (prev) {
			//util.log("giving gameStructure["+n+"] the property: "+previ.n);
			this[n][previ.n] = this[previ.n];
		}
		if (next) {
			//util.log("giving gameStructure["+n+"] the property: "+nexti.n);
			this[n][nexti.n] = this[nexti.n]; //should definitely double check this
		}
		this[n].programStructure = this;

		if (this[n].programStructureHasInitialized != undefined)
			this[n].programStructureHasInitialized();
		//this[n].registerStructure(prev,next,this);
		}
	}
}
ProgramStructure.prototype.distribute = function(name, obj) {
  for (var i=0; i < this.nameList.length; i++) {
  	this[this.nameList[i]][name] = obj;
  }
}
ProgramStructure.prototype.trigger = function() { //pass directly to callbacks
	return this.callbacks.trigger.apply(this.callbacks, arguments);
}
ProgramStructure.prototype.register = function() {
	return this.callbacks.register.apply(this.callbacks, arguments);
}
module.exports = ProgramStructure;
/*
function InitializeClientStructure(obj, instructions) {
	obj = obj || {};
	if (instructions == undefined) {
		instructions = [{n:"clientSocket", d:ClientSocket},
		{n:"handlerBridge", d:HandlerBridgeClientSide},
		{n:"clientBehavior", d:ClientBehavior},
		{n:"gameHandler", d:GameHandler}
	
		];
	}
	var gst = new GameStructure(obj, instructions);
	gst.codes = new CodeManager();
	gst.codes.registerCode("connectedToServer");
}
function InitializeServerStructure(obj, instructions) {
	obj = obj || {};
	if (instructions == undefined) {
		instructions = [{n:"gameServer", d:GameServer},
			{n:"serverHandlerLink", d:ServerHandlerLink},
			{n:"handlerBridge", d:HandlerBridgeServerSide},
			{n:"serverBehavior", d:ServerBehavior},
			{n:"gameHandler", d:GameHandler}
		];
	}

	return new GameStructure(obj, instructions);
}
if (!this.___alexnorequire) {
	exports.InitializeServerStructure = InitializeServerStructure;
}
*/
