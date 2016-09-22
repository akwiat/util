
function Control(name, onPressed) {
	this.name = name;
	this.onPressed = onPressed;
	this.status = false;
}
Control.prototype.setStatus = function(status) {
	this.status = status;
}

function ControlSet(name) {
	this.name = name;
	this.controls = {};
}
ControlSet.prototype.add = function(name, onPressed) {
	var nControl = new Control(name, onPressed);
	this.controls[name] = nControl;
	return nControl;
}
ControlSet.prototype.setOnPressed = function(name, onPressed) {
    this.controls[name].onPressed = onPressed;
}
ControlSet.prototype.status = function(name) {
	return this.controls[name].status;
}
function ControlsManager(settings) {

	this.domElement = window.document;
	this.controlSets = {};
	var okc = ControlsManager.onKeyChange.bind(this);
	this.domElement.addEventListener("keydown", okc, false);
	this.domElement.addEventListener("keyup", okc, false);
	this.activate();
}
ControlsManager.getKeyCode = function(key) {
	return key.toUpperCase().charCodeAt(0);
}
ControlsManager.onKeyChange = function(event) {
	if (!this.isActivated) return;
    var keyCode		= event.keyCode
	var pressed		= event.type === 'keydown' ? true : false
	//debugger;
	if (this[keyCode]) {
	  for (var i=0; i < this[keyCode].length; i++) {
	    this[keyCode][i].setStatus(pressed);
	  }
	}
}
ControlsManager.prototype.activate = function() {
	this.isActivated = true;
}
ControlsManager.prototype.deactivate = function() {
	this.isActivated = false;
}
ControlsManager.prototype.status = function(setName, cName) {
	return this.controlSets[setName].status(cName);
}
ControlsManager.prototype.addKey = function(key, control) {
	var numkey = ControlsManager.getKeyCode(key);
	if (this[numkey] == undefined) this[numkey] = [];
	this[numkey].push(control);
}
ControlsManager.prototype.addLeftRightJump = function(name) {
	var keys = {left:"a", right: "d", jump: "w"};
	var res = this.quickAdd(name,keys);
	return res;
}
ControlsManager.prototype.quickAdd = function(name, keys) {
	var result = new ControlSet(name);
	for (var o of Object.keys(keys)) {
		var c = result.add(o);
		this.addKey(keys[o], c);
	}
	this.controlSets[name] = result;
	return result;
}

module.exports = ControlsManager;