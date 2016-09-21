define([], function() {
  var SerializeInfo = function(settings) {
  	this.code = settings.code;
  	this.createFn = settings.createFn;
  	this.tojsonFn = settings.tojson;
  	this.applySpecificData = settings.applySpecificData;
  }
  var deSerializerInfo = function(propName, createFn, applySpecificData) {
  	this.propName = propName;
  	this.createFn = createFn;
  	this.applySpecificData = applySpecificData
  }
  var applySpecificData = function(obj) {
  	var deserializer = this.constructor.deserializer;
  	//debugger;
    for (var i in obj) {
    	if (!obj.hasOwnProperty(i)) continue;
    	//debugger;
    	var o = obj[i];
    	if (deserializer) var di = deserializer[i]; 
    	else {
    		this[i] = o; continue;
    	}
    	if (!di)
    	  this[i] = o;
    	else if (di.createFn !== undefined) {
    	  this[di.propName] = new di.createFn();
    	}
    	else
    	  this[di.propName] = o;

    	if (di) {
    	  if (di.applySpecificData)
    	  	di.applySpecificData.call(this[di.propName],o, this);
    	  else if (this[di.propName].applySpecificData)
    	    this[di.propName].applySpecificData(o);
    	}
    }
  }
  var makeFromObj = function(Class, obj) {
  	//debugger;
    var ret = new Class();
    ret.applySpecificData(obj);
    return ret;
  }
  var makeFromStr = function(Class, str) {
  	//debugger;
    return Class.makeFromObj(JSON.parse(str));
  }
  var regularFn = function() {
    return this;
  }
  var useSerializer = function() {
  	var serializer = this.constructor.serializer;
  	//debugger;
  	var ret = {};
  	for (var i in this) {
  		if (this.hasOwnProperty(i)) {

  			var si = serializer[i];

  			var tj = undefined;
  			if (this[i] && si && si.tojsonFn) tj = si.tojsonFn(this[i]);

  			
  			if (si === undefined)
  			  ret[i] = tj || this[i];
  			else if (si == null)
  			  ret[i] = undefined;
  			else
  			  ret[si.code] = tj || this[i];
  		}
  	}
  	return ret;
  	/*
  	var serializer = this.constructor.prototype.serializer;
  	var ret = {};
    for (var i in serializer.baseSerializer) {
      var o = serializer[i];
      ret[o] = this[i];
    }
    for (var i in serializer.skipValues) {
    	ret[i] = undefined;
    }
    return ret;
    */
  }
  var arrayToJSON = function(obj) {
  	//debugger;
		var ret = [];
		//debugger;
		for (var i=0; i < obj.length; i++) {
			ret.push(obj[i].toJSON());
			//debugger;
		}
		return ret;
  }
  var produceSerializers = function(Class, serializerObj) {
    Class.serializer = Class.serializer || {};
    Class.deserializer = Class.deserializer || {};

  	var serializer = Class.serializer;
  	var deserializer = Class.deserializer;

  	for (var i in serializerObj) {
  		var si = undefined;
  		if (serializerObj[i])
  		  si = new SerializeInfo(serializerObj[i]);
  		else
  		  si = serializerObj[i]; //undefined or null
  		

  		
  		serializer[i] = si;
  		if (!si) continue;
  		deserializer[si.code] = new deSerializerInfo(i, si.createFn, si.applySpecificData);
  	}
  	//return {s:serializer, d:deserializer};
  }
  var copyStuff = function(ClassSource, ClassTarget) {
  	ClassTarget.serializer = ClassSource.serializer;
  	ClassTarget.deserializer = ClassSource.deserializer;
  }
  var Serialize = function(Class, serializerObj) {
  	var settings = undefined;
  	if (serializerObj) {
  		produceSerializers(Class, serializerObj);
  	  //var s = produceSerializers(Class, serializerObj);
      //Class.serializer = s.s;
      //Class.deserializer = s.d;

      Class.prototype.toJSON = useSerializer;
      //Class.makeFromObj = makeFromObj.bind(undefined, Class);
      Class.prototype.applySpecificData = (settings && settings.applySpecificData) ? settings.applySpecificData : applySpecificData
    }
    else {
      //Class.prototype.toJSON = regularFn;
      //Class.makeFromObj = makeFromObj.bind(undefined, Class);
    }
    Class.makeFromObj = makeFromObj.bind(undefined, Class);
    Class.makeFromStr = makeFromStr.bind(undefined, Class);
  }
  Serialize.copyStuff = copyStuff;
  //Serialize.SerializeInfo = SerializeInfo;
  Serialize.arrayToJSON = arrayToJSON;
  return Serialize;
});

