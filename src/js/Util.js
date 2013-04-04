/**
 * @description A couple of utility functions
 * @author <a href="mailto:alex@flanche.net">Alex Dumitru</a>
 * @author <a href="mailto:vlad@flanche.net">Vlad Merticariu</a>
 */

_.mixin({
  /**
   * Gets the id of a selector and generates one if the nodes is lacking
   * @param selector any jQuery selector
   * @return {String} the id of the selected element
   */
  getId: function(selector){
    if(!jQuery(selector).attr('id')){
      var id = _.uniqueId("satree-");
      jQuery(selector).attr('id', id);
      return id;
    }
    return jQuery(selector).attr('id');
  },

  /**
   * Does a deep clone on an object
   * BEWARE: jQuery does not do a great job at this, some elements might be cloned badly
   * if you know the structure of an object you should create a special clone function for it
   * e.g. see satree.Node.clone
   * @param obj the object to be cloned
   * @return {Object} the cloned object
   */
  cloneDeep: function(obj){
    var newObj = {};
    jQuery.extend(true, newObj, obj)
    return newObj;
  },

  warn : function(message){
    if(console && console.warn){
      console.warn(arguments);
    }
    else{

    }
  }
})