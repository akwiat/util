function GeneralCooldown(dt, onComplete, ou) {
	this.type = "GeneralCooldown"
	this.waitTime = dt;
	this.onComplete = onComplete;
	this.updateFn = ou;

	this.startTime = undefined;
}
GeneralCooldown.prototype.attempt = function(gt) {
	if (!gt) debugger;
	if (this.isActive()) return false;
	else this.beginCooldown(gt);
	console.log("begining Cooldown")

	return true;
}
GeneralCooldown.prototype.isActive = function() {
	return (this.startTime);
}
GeneralCooldown.prototype.beginCooldown = function(st) {
	//debugger;
	this.startTime = st;
}
GeneralCooldown.prototype.resetCooldown = function() {
	if (this.updateFn) this.updateFn(0);
	this.startTime = undefined;
}
GeneralCooldown.prototype.checkTime = function(curT) {
	//console.log("checkTime");
	if (this.startTime == undefined)
		throw new Error("cooldown problem");

	var remaining = this.startTime - curT + this.waitTime;
	if ( remaining <= 0 ) {
		if (this.onComplete)
			this.onComplete(curT);
		console.log("completed")
		this.resetCooldown();
	}

	if (remaining < 0.0) remaining = 0.0;
	return remaining;
}
GeneralCooldown.prototype.onUpdate = function(curT) {
	//debugger;
	// console.log("onUpdate");
	if (this.isActive()) {
		//debugger;
	var remaining = this.checkTime(curT);
	if (this.updateFn) this.updateFn(remaining);
	}
}

function DoubleCooldown(dt1, onComplete1, hud1, dt2, onComplete2, hud2) {
	console.log("doubleCooldown constructor");
	this.type = "DoubleCooldown";
	this.cooldownStarted = false;
	this.inFirstCooldown = false;
	this.inSecondCooldown = false;
	var transition = function(gt) {
		console.log("transition");
		onComplete1(gt);
		this.inFirstCooldown = false;
		var canSecondCooldown = this.secondCooldown.attempt(gt);
		//if (canSecondCooldown)
		if (!canSecondCooldown) debugger;
		this.inSecondCooldown = true;
	}
	var onFinalComplete = function() {
		console.log("onFinalComplete")
		if (onComplete2) onComplete2();
		this.inSecondCooldown = false;
		this.cooldownStarted = false;
	}
	this.firstCooldown = new GeneralCooldown(dt1, transition.bind(this), hud1);
	this.secondCooldown = new GeneralCooldown(dt2, onFinalComplete.bind(this), hud2);
}

DoubleCooldown.prototype.attempt = function(gt) {
	if (this.inSecondCooldown) return false;

	var canFirstCooldown = this.firstCooldown.attempt(gt);
	//if (this.inSecondCooldown)
	if (canFirstCooldown) {
	this.cooldownStarted = true;
	this.inFirstCooldown = true;
	}

	return canFirstCooldown;
}

DoubleCooldown.prototype.onUpdate = function(gt) {
	if (!this.cooldownStarted) return;
	if (this.inFirstCooldown) {
		this.firstCooldown.onUpdate(gt);
	} else {
		this.secondCooldown.onUpdate(gt);
	}
}
DoubleCooldown.prototype.resetCooldown = function() {
	this.cooldownStarted = false;
	if (this.firstCooldown) this.firstCooldown.resetCooldown();
	if (this.secondCooldown) this.secondCooldown.resetCooldown();
	this.inFirstCooldown = false;
	this.inSecondCooldown = false;
	//this.
}

function CooldownManager() {
	this.runningCooldowns = [];
}
CooldownManager.prototype.onUpdate = function(curT) {
	for (var i=0; i < this.runningCooldowns.length; i++) {
		this.runningCooldowns[i].onUpdate(curT);
	}
}
CooldownManager.prototype.addCooldown = function(c) {
	this.runningCooldowns.push(c);
}
