/**
 * @description Defines a basic tree that can be rendered on an html page
 * @author <a href="mailto:alex@flanche.net">Alex Dumitru</a>
 * @author <a href="mailto:vlad@flanche.net">Vlad Merticariu</a>
 */


FlancheJs.defineClass("satree.Node", {

  /**
   * Constructor function for a node
   * @param content the content of the node
   * @param id the id of the one, if none given one will be generated
   */
  init: function(content, id){
    this.setContent(content);
    this.$id = id || _.uniqueId("satree-node-");
  },

  properties: {
    //the content of the node
    content : {
      value: null
    },
    //the parent of this node, for root it's null
    parent  : {
      value: null,
      set  : function(node){
        if(node && !_.contains(node.getChildren(), this)){
          node.addChild(this);
        }
        this.$parent = node;
      }
    },
    //the children of this node as an array
    children: {
      value: [],
      set  : function(nodes){
        var self = this;
        _.each(nodes, function(node){
          self.addChild(node);
        })
      }
    },

    //tags the element for special operations
    tag     : {
      value: null
    },

    //the id of the element from which this node was generated
    mathId  : {
      value: null
    },

    //id of the node
    id      : {
      value: null
    }
  },

  methods: {
    /**
     * Adds a new child to this node
     * @param {satree.Node} node the node to be added
     */
    addChild: function(node){
      this.$children.push(node);
      node.setParent(this);
    },

    /**
     * Removes a child from the node
     * BEWARE: This leads to a reorganization of the children of the node
     * @param {satree.Node} node the node to be removed
     */
    removeChild: function(node){
      node.setParent(null);
      var children = this.getChildren();
      for(var i = 0; i < children.length; i++){
        if(children[i] == node){
          this.$children.splice(i, 1);
        }
      }
    },

    /**
     * Applies the given function to all elements in the nodes in a BFS manner.
     * @param callback the function to be applied
     */
    forEach: function(callback){
      callback.call(this, this);
      var self = this;
      _.each(this.getChildren(), function(child){
        self.forEach.call(child, callback);
      });
    },

    /**
     * Returns true if the tree is a leaf (0 children), false otherwise
     * @return {Boolean}
     */
    isLeaf: function(){
      return this.getChildren().length == 0
    },

    /**
     * Returns true if this node is a root (no parent), false otherwise
     * @return {Boolean}
     */
    isRoot: function(){
      return this.getParent() == null
    },

    /**
     * Returns a subtree starting from the given node.
     * BEWARE: Not thoroughly tested
     * @param stopNode
     * @return {satree.Node} the given node
     */
    getSubtree: function(stopNode){
      var newTree = this.clone()
      var newStopNode = null;
      newTree.forEach(function(node){
        if(node.getContent() == stopNode.getContent() && stopNode.getMathId() == node.getMathId()){
          newStopNode = node;
        }
      });
      newStopNode.getParent().removeChild(newStopNode);
      return newTree;
    },

    /**
     * Returns a clone of the node.
     * BEWARE: All the properties of the tree are cloned *except* the id.
     * @return {satree.Node}
     */
    clone: function(){
      return this._cloneRecursive(this);
    },

    /**
     * Replaces a given node with a new one
     * @param oldNode the old node to be replace
     * @param newNode the new node that will replace the old one
     * @return {satree.Node} the *whole* tree
     */
    replace: function(oldNode, newNode){
      var newTree = null;
      if(this.getId() == oldNode.getId()){
        newNode.setParent(null)
        newTree = newNode.clone();
      }
      else{
        var newTree = this.clone()
        var oldNodeInNewTree = null;
        newTree.forEach(function(node){
          if(node.getId() == oldNode.getId()){
            oldNodeInNewTree = node;
          }
        });
        var parent = oldNodeInNewTree.getParent();
        parent.removeChild(oldNodeInNewTree);
        parent.addChild(newNode);
        newNode.setParent(parent);
      }
      return newTree;
    }
  },

  internals: {
    /**
     * Helper for the clone function
     * @param tree the given tree to be cloned
     * @return {satree.Node} the cloned node
     */
    cloneRecursive: function(tree){
      var newTree = new satree.Node(tree.getContent(), tree.getId());
      newTree.setMathId(tree.getMathId());
      for(var i = 0; i < tree.getChildren().length; i++){
        newTree.addChild(this._cloneRecursive(tree.getChildren()[i]));
      }
      return newTree;
    }
  }

});
