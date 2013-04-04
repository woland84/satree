/**
 * @TODO comment
 */
(function (win) {

  var util = {

    clone:function (obj) {
      if (obj == null || typeof(obj) != 'object')
        return obj;

      var temp = new obj.constructor();
      for (var key in obj)
        temp[key] = util.clone(obj[key]);

      return temp;
    },

    exists:function (variable) {
      if (variable === null || variable === undefined) {
        return false;
      }
      return true;
    },


    createClassObject:function (name, constructor, parentClass, traits, properties, internals) {
      var parts = name.split(".");
      var current = win;
      if (parts.length > 1) {
        for (var i = 0; i < parts.length - 1; i++) {
          var part = parts[i];
          if (!this.exists(current[part])) {
            current[part] = new Object();
          }
          current = current[part];
        }
      }

      var extender = function () {
        for(var propIndex in properties){
          this["$" + propIndex] = util.clone(properties[propIndex].value);
        }
        for(var intIndex in internals){
          this["_" + intIndex] = util.clone(internals[intIndex]);
        }
        if (util.exists(parentClass)) {
          for (var protIndex in parentClass.prototype) {
            if ((protIndex.charAt(0) == "_" && protIndex.charAt(1) != "_") || protIndex.charAt(0) == "$") {
              if (!parentClass.prototype[protIndex] instanceof Function) {
                this[protIndex] = util.clone(parentClass.prototype[protIndex]);
              }
            }
          }
        }
        if (util.exists(traits)) {
          for (var i = 0; i < traits.length; i++) {
            for (var traitIndex in traits[i].internals) {
              this["_" + traitIndex] = util.clone(traits[i].internals[traitIndex]);
            }
            for (var traitIndex in traits[i].properties) {
              this["$" + traitIndex] = util.clone(traits[i].properties[traitIndex].value);
            }
          }
        }
        constructor.apply(this, arguments);
      }
      current[parts[parts.length - 1]] = extender;

      current = current[parts[parts.length - 1]];
      return current;
    },

    addPropertyToClass:function (classObj, property, config) {
      var methodProp = property.charAt(0).toUpperCase() + property.slice(1);
      classObj.prototype["$" + property] = config.value;
      classObj.prototype["get" + methodProp] = this.exists(config.get) ? config.get : function () {
        return this["$" + property];
      }
      classObj.prototype["set" + methodProp] = this.exists(config.set) ? config.set : function (value) {
        this["$" + property] = value;
      }
    },

    addPropertiesToClass:function (classObj, properties) {
      for (var prop in properties) {
        if (properties[prop] instanceof Object) {
          this.addPropertyToClass(classObj, prop, properties[prop]);
        }
        else {
          throw Error("The property should be an object, either {}, or something like {get : function(){}..}");
        }
      }
    },

    addStaticsToClass:function (classObj, statics) {
      for (var stat in statics) {
        classObj[stat] = statics[stat];
        classObj.prototype[stat] = statics[stat];
      }
    },

    addMethodsToClass:function (classObj, methods, override) {
      for (var name in methods) {
        if (!override && this.exists(classObj.prototype[name]) && classObj.hasOwnProperty(name)) {
          continue;
        }
        classObj.prototype[name] = methods[name];
      }
    },

    checkNeedsInClass:function (classObj, trait) {
      for (var prop in trait.needs) {
        var req = classObj.prototype[prop];
        if (!this.exists(req) || !(req instanceof trait.needs[prop])) {
          throw Error("Your class has not passed the traits checks. You need to fulfill this dependency: [" + prop + ":" + trait.needs[prop].name + "]")
        }
      }
    },

    addTraitsToClass:function (classObj, traits) {
      for (var i = 0; i < traits.length; i++) {
        var trait = traits[i];
        this.checkNeedsInClass(classObj, trait);
        /**
         * @todo Why do methods need to exist?
         */
        if (this.exists(trait.methods)) {
          this.addMethodsToClass(classObj, trait.methods);
          this.addInternalsToClass(classObj, trait.internals);
          this.addPropertiesToClass(classObj, trait.properties);
        }

      }
    },

    addInternalsToClass:function (classObj, internals) {
      for (var prop in internals) {
        var propName = "_" + prop;
        classObj.prototype[propName] = internals[prop];
      }
    },

    extendClass:function (classObj, parentClass) {
      try{
        classObj.prototype = new parentClass;
      }
      catch(e){
        throw Error("The class that you are trying to extend throws a fatal error when calling the constructor." +
          "Please adjust it so that it won't throw an error if no parameters are passed.")
      }
      classObj.prototype.parent = parentClass;
      classObj.prototype.constructor = classObj;
    },

    createTrait:function (trait, props) {
      var parts = trait.split(".");
      var current = win;
      for (var i = 0; i < parts.length - 1; i++) {
        if (!this.exists(current[parts[i]])) {
          current[parts[i]] = new Object();
        }
        current = current[parts[i]];
      }
      current[parts[parts.length - 1]] = props;
      return current;
    },

    addNeeds:function (classObj, needs) {
      classObj.__needs__ = needs;
    },

    addMetaData:function (classObj, name, extend, implement) {
      classObj.prototype.__meta__ = {
        name      :name,
        extends   :extend,
        implements:implement
      }
    }

  }

  var flancheJs = {
    defineClass:function (name, props) {
      if (util.exists(props["init"])) {
        var classObj = util.createClassObject(name, props["init"], props['extends'], props['implements'], props['properties'], props['internals']);
      }
      else {
        throw Error("Your class should have one constructor. You might want to define a trait if you do not need a constructor.");
      }
      if (util.exists(props["extends"])) {
        util.extendClass(classObj, props["extends"]);
      }
      if (util.exists(props["methods"])) {
        util.addMethodsToClass(classObj, props["methods"], true);
      }
      if (util.exists(props["properties"])) {
        util.addPropertiesToClass(classObj, props["properties"]);
      }
      if (util.exists(props["statics"])) {
        util.addStaticsToClass(classObj, props["statics"]);
      }
      if (util.exists(props['internals'])) {
        util.addInternalsToClass(classObj, props["internals"])
      }
      if (util.exists(props["implements"])) {
        var impl = props["implements"];
        if (!impl instanceof Array) {
          impl = [impl];
        }
        util.addTraitsToClass(classObj, impl);
      }

      util.addMetaData(classObj, name, props['extends'], props['implements']);
    },

    defineTrait:function (name, props) {
      props.needs = props.needs ? props.needs : {};
      props.properties = props.properties ? props.properties : {};
      props.methods = props.methods ? props.methods : {};
      var classObj = util.createTrait(name, props);
    }
  }

  win["FlancheJs"] = flancheJs;

})(window);