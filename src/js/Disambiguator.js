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
  init: function (tree) {
    this._tree = tree;
  },

  methods: {
    /**
     * Generates a set of trees from an ambiguous tree
     * @return {Array}
     */
    generateTrees: function () {
      var originalTree = this._tree;
      var finalTrees = [];
      var ambiguousTrees = [originalTree]
      while (ambiguousTrees.length) {
        var currentTree = ambiguousTrees.pop()
        var genTrees = this._generateTreesRecursive(currentTree);
        for (var i = 0; i < genTrees.length; i++) {
          if (this._treeHasAmbiguities(genTrees[i])) {
            ambiguousTrees.push(genTrees[i]);
          }
          else {
            finalTrees.push(genTrees[i]);
          }
        }
      }
      return finalTrees;
    }
  },

  internals: {
    //the tree to disambiguate
    tree     : null,
    //the node where the ambiguation occurs
    splitNode: null,
    //the sub trees under the ambiguation node
    applys   : null,
    searchNoMore : false,


    generateTreesRecursive: function (tree) {
      var splitters = this._lookupCdlfNodes();
      var trees = [];
      if (splitters.applys) {
        for (var i = 0; i < splitters.applys.length; i++) {
          var newTree = tree.clone().replace(splitters.splitNode, splitters.applys[i]);
          trees.push(newTree);
        }
      }
      else {
        trees.push(tree);
      }
      return trees;
    },

    treeHasAmbiguities: function (tree) {
      var hasAmbig = false;
      tree.forEach(function (item) {
        if (item.getTag() == "ambiguous") {
          hasAmbig = true
        }
      })
      return hasAmbig;
    },

    /**
     * Looks up ambiguous tagged nodes in the tree
     */
    lookupCdlfNodes: function () {
      var ret = {
        applys   : null,
        splitNode: null
      }
      this._searchNoMore = false;
      this._lookupCdlfNodesRecursive(this._tree, ret)
      return ret;
    },

    /**
     * Helper function to search the tree recursively for ambiguous tagged nodes
     * @param tree the tree in which to search
     * @param ret the object in which the applys and splitNode will be put
     */
    lookupCdlfNodesRecursive: function (tree, ret) {
      if (tree.getTag() == "ambiguous" && !this._searchNoMore) {
        tree.setTag(null);
        this._searchNoMore = true;
        ret.applys = tree.getParent().getChildren().slice(1);
        ret.splitNode = tree.getParent();
        return;
      }
      else {
        if (tree.isLeaf()) {
          return;
        }
        var self = this;
        tree.getChildren().forEach(function (node) {
          self._lookupCdlfNodesRecursive(node, ret);
        })
      }
    }
  }

});
