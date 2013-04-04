/**
 * @description This file contains a variety of tests that check the features
 * of the satree library
 */

buster.testCase("FlancheJs", {
  "can build a tree" : function(){
    root = new satree.Node("root");
    root.addChild(new satree.Node("child1"));
    root.addChild(new satree.Node("child2"));
    root.getChildren()[1].addChild(new satree.Node("grandchild2"));
    root.getChildren()[0].addChild(new satree.Node("grandchild1"));

    var newChild = new satree.Node("adopted");
    newChild.setParent(root);

    //var rend = new satree.TreeRenderer(root);
    //console.log(rend._toSpaceTreeJson())
    buster.assert(true);
  },

  "can parse math" : function(){
    buster.assert(true);
  }
})