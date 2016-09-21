define(["util/Serialize", "util/Tree"], function(Serialize, Tree){
	function Plugin() {

	}
	Plugin.addTo = function(Class, PluginName, settings) {
		PluginName(Class, settings);
	}
	Plugin.Serialize = Serialize;
	Plugin.TreeNode = Tree.makeTreeNode;
	return Plugin;
});