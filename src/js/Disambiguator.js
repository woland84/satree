/**
 * @description Looks for ambiguos parts in a tree
 * @author <a href="mailto:alex@flanche.net">Alex Dumitru</a>
 * @author <a href="mailto:vlad@flanche.net">Vlad Merticariu</a>
 */

FlancheJs.defineClass("satree.Disambiguator", {

  /**
   * Constructor for the disambiguator
   * @param {satree.Node} tree the tree to be disambiguated
   */
  init: function(tree){
    this._tree = tree;
  },

  methods: {
    /**
     * Generates a set of trees from an ambiguous tree
     * @return {Array}
     */
    generateTrees: function(){
      this._lookupCdlfNodes();
      var trees = [];
      var self = this;
      if(this._applys){
        for(var i = 0; i < this._applys.length; i++){
          var newTree = self._tree.clone().replace(self._splitNode, self._applys[i]);
          trees.push(newTree);
        }
      }
      else{
        trees.push(this._tree);
      }
      return trees;
    }
  },

  internals: {
    //the tree to disambiguate
    tree     : null,
    //the node where the ambiguation occurs
    splitNode: null,
    //the sub trees under the ambiguation node
    applys   : null,

    /**
     * Looks up ambiguous tagged nodes in the tree
     */
    lookupCdlfNodes: function(){
      this._lookupCdlfNodesRecursive(this._tree)
    },

    /**
     * Helper function to search the tree recursively for ambiguous tagged nodes
     * @param tree the tree in which to search
     */
    lookupCdlfNodesRecursive: function(tree){
      if(tree.getTag() == "ambiguous"){
        this._applys = tree.getParent().getChildren().slice(1);
        this._splitNode = tree.getParent();
        return;
      }
      else{
        if(tree.isLeaf()){
          return;
        }
        var self = this;
        tree.getChildren().forEach(function(node){
          self._lookupCdlfNodesRecursive(node);
        })
      }
    }
  }

});
