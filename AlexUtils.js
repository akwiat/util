define([], function(){
var AlexUtil = {};
AlexUtil.getNextAvailable = function(array) {
	var i=0;
	while (i < array.length) {
		if (array[i] == undefined)
			return i
		i++;
	}
	return array.length;
	//var ret = array.length;
	//array.push()
	//throw new Error("getNextAvailable failed: "+i);
}
var BasicIdManager = function() {
	this.idList = [];
}
BasicIdManager.prototype.requestId = function() {
    var id = AlexUtil.getNextAvailable(this.idList);
    this.idList[id] = true;
    return id;
}
BasicIdManager.prototype.releaseId = function(id) {
	if (this.idList[id] == undefined) throw new Error("badId");
	this.idList[id] = undefined;
}
AlexUtil.BasicIdManager = BasicIdManager;

var TrackedObj = function TrackedObject() {
}
TrackedObj.prototype.register = function(str, obj) {
	if (this[str] != undefined) throw new Error("already taken")

	this[str] = obj;
}
TrackedObj.prototype.forEach = function(fn) {
	for (var i in this)
		if (this.hasOwnProperty(i))
			fn(this[i]);
}
AlexUtil.TrackedObj = TrackedObj;

return AlexUtil;
});
/*
if (!this.___alexnorequire) {
	exports.AlexUtil = AlexUtil;
	exports.BasicIdManager = BasicIdManager;
}
*/