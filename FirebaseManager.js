define([], function() {
    function FirebaseManager() {
    	this.ref = firebase.database().ref();
    }
    FirebaseManager.prototype.getRef = function() {
    	return this.ref;
    }
    FirebaseManager.prototype.runTest = function() {
    	//debugger;
    	this.ref.child("trees").set({tree1:"stringfortree1"});
    }
    return FirebaseManager;

});