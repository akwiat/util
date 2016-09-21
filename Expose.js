define([], function() {
  function Expose(source, target, options) {
  	if(!options) {
		var arr = Object.getOwnPropertyNames(source.prototype);
		for (var o of arr) {
		if (o != "constructor")
			target.prototype[o] = source.prototype[o];
	}
  	} else if (options.propertyList) {
  		for (var i=0; i < options.propertyList.length; i++) {
  		  var name = options.propertyList[i];
  		  target.prototype[name] = source.prototype[name];
  		}
  	}
  }

  return Expose;
});