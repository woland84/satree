/**
 * @description Contains all the configurations needed for the library
 * @author <a href="mailto:alex@flanche.net">Alex Dumitru</a>
 * @author <a href="mailto:vlad@flanche.net">Vlad Merticariu</a>
 */

FlancheJs.defineClass("satree._ConfigManager", {

  init : function(){

  },

  properties: {

    //Display the math in summary form when the node is collapsed
    summarizedMode : {
      value : false
    },

    //Render the nodes either using Math display (i.e. operator is the root) or Apply display mode (i.e. apply sign is the root)
    renderMode : {
      value : satree.MathParser.ModeApply
    },

    //The url where the results of the disambiguation should be submitted
    submitUrl : {
      value : null
    }

  }

})

satree.ConfigManager = new satree._ConfigManager();