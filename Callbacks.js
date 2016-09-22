function Callbacks() {
	this.objs = {};

	this.delayedCalls = [];
	//this.oneShots = {};
}
Callbacks.prototype.register = function(fn, msg, typecode) {
	if (msg == undefined || fn == undefined) 
		throw new Error("register bad parameters");
	if (this.objs[msg] == undefined)
		this.objs[msg] = {};
	var nested = this.objs[msg];
	if (typecode == undefined)
		typecode = Callbacks.DEFQUALIFIER;
	if (nested[typecode] == undefined)
		nested[typecode] = [];

	nested[typecode].push(fn);
}
Callbacks.prototype.triggerDelayed = function(obj, msg, typecode, nThis) {
	var pushObj = {};
	pushObj.obj = obj;
	pushObj.msg = msg;
	pushObj.typecode = typecode;
	pushObj.nThis = nThis;
	this.delayedCalls.push(pushObj);
}
Callbacks.prototype.callDelayedFns = function() {
	for (var i=0; i < this.delayedCalls.length; i++) {
		var obj = this.delayedCalls[i];
		this.trigger(obj.fn, obj.msg, typecode, nThis);
	}
}
Callbacks.prototype.trigger = function(obj, msg, typecode, nThis) {
	/*
	if (console)
		console.log("Callbacks::trigger, msg: "+msg+", typecode: "+typecode);
	*/
	if (msg == undefined)
		throw new Error("trigger bad parameters");
	var retvals = [];
	if (this.objs[msg] != undefined) {
		var nested = this.objs[msg];
		if (typecode == undefined)
			typecode = Callbacks.DEFQUALIFIER;

		if (nested[typecode] != undefined) {
			for (var i=0,l=nested[typecode].length; i<l; i++) {
				var rv = nested[typecode][i].call(nThis, obj);
				retvals.push(rv);
			}
		} else {
			//throw new Error("bad trigger qualifier: "+typecode);
		}
	} else {
		//throw new Error("bad trigger msg: "+msg);
	}

	if (retvals.length == 0)
		return undefined;
	if (retvals.length == 1)
		return retvals[0];
	else
		return retvals;
	//this.callOneShot(msg, typecode, obj, obj.gsid);
}
/*
Callbacks.prototype.callOneShot = function(msg, typecode, obj, gsid) {
	if (this.oneShots[msg] != undefined) {
		var nest1 = this.oneShots[msg];
		if (nest1[typecode] !== undefined) {
			var nest2 = nest1[typecode];
			var array = nest2[gsid];
			if (array != undefined) {
				for (var i=array.length-1; i >= 0; i--){
					array[i](obj);
					array.pop();
				}
			}
		}
	}
}
Callbacks.prototype.registerOneShot = function(msg, typecode, gsid, fn) {
	if (this.oneShots[msg] == undefined) 
		this.oneShots[msg] = {};
	var nest1 = this.oneShots[msg];

	if (typecode == undefined)
		typecode = Callbacks.DEFQUALIFIER;

	if (nest1[typecode] == undefined)
		nest1[typecode] = {}
	var nest2 = nest1[typecode];

	if (nest2[gsid] == undefined)
		nest2[gsid] = [];

	nest2[gsid].push(fn);
}
*/
Callbacks.DEFQUALIFIER = "all";
module.exports = Callbacks;

