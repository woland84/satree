//we define the module for JOBAD here


JOBAD.modules.register({
    info:{
        'identifier':   'math.satree',
        'title':    'SaTree Module',
        'author':   'Tom Wiesing',
        'description':  'Enables the SATree library on the page. ',
    },
    config: {
    	"tree_display": ["list", ["apply", "math"], "apply", ["Tree Display", "Apply Mode", "Math Mode"]],
    	"summarise_math": ["bool", false, ["Summarize Math"]]
    },
    configUpdate: function(setting, JOBADInstance){
    	if(setting == "tree_display"){ //Tree mode
    		if(this.UserConfig.get("tree_display") == "apply"){
    			satree.ConfigManager.setRenderMode(satree.MathParser.ModeApply);
			} else {
				satree.ConfigManager.setRenderMode(satree.MathParser.ModeMath);
			}
    	}
    	if(setting == "summarise_math"){
    		satree.ConfigManager.setSummarizedMode(this.UserConfig.get("summarise_math")); 
    	}
    },
    init: function(JOBADInstance){
    	var manager = new satree.Manager(JOBADInstance.element);
        this.localStore.set("manager", manager); //Store the manager in the local Store for this module
    },
    activate: function(){
    	this.localStore.get("manager").run();
    },
    deactivate: function(){
    	this.localStore.get("manager").stop();
    },
    leftClick: function(target){
    	var target = target.closest("math");
    	if(target.length > 0){
    		var man = this.localStore.get("manager"); 
    		man._listenerFunction.call(target.get(0), man); 
    	}
    }
});



})(jQuery.noConflict(), JOBAD.util); 