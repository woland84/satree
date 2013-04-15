/**
 * @description Renders a satree.Node using an external library
 * @author <a href="mailto:alex@flanche.net">Alex Dumitru</a>
 * @author <a href="mailto:vlad@flanche.net">Vlad Merticariu</a>
 */

FlancheJs.defineClass("satree.TreeRenderer", {

  init: function (tree, selector, renderMode) {
    this.setTree(tree);
    this.setSelector(selector);
    if (renderMode) {
      this.setRenderMode(renderMode)
    }
    else {
      this.setRenderMode(this.SpaceTree);
    }
  },

  properties: {
    tree: {
      value: null
    },

    selector: {
      value: null
    },

    renderMode: {
      value: null
    },

    offsetX: {
      value: 0
    },

    offsetY: {
      value: 125
    }
  },

  methods: {
    streamUpContent: function (node) {

    },

    render: function () {
      var that = this;
      var json = this._toSpaceTreeJson();
      this._tree = new $jit.ST({
        //id of viz container element
        injectInto   : _.getId(this.getSelector()),
        //set duration for the animation
        duration     : 100,
        levelsToShow : 100,
        offsetX      : this.getOffsetX(),
        offsetY      : this.getOffsetY(),
        //set animation transition type
        transition   : $jit.Trans.Quart.easeInOut,
        //set distance between node and its children
        levelDistance: 20,
        //enable panning
        Navigation   : {
          enable : true,
          panning: true
        },
        //set node and edge styles
        //set overridable=true for styling individual
        //nodes or edges
        Node         : {
          type       : 'ellipse',
          color      : '#A1A4C5',
          autoWidth  : true,
          height     : 0,
          overridable: true
          // dim: 25
        },

        Edge: {
          type       : 'bezier',
          lineWidth  : 2,
          color      : '#CBCDCD',
          overridable: true
        },

        onBeforeCompute: function (node) {
        },

        onAfterCompute  : function () {
        },

        //This method is called on DOM label creation.
        //Use this method to add event handlers and styles to
        //your node.
        onCreateLabel   : function (label, node) {
          if (satree.ConfigManager.getSummarizedMode() && node._depth) {
            var content = "";
            var mathNode = document.getElementById(node.id.split("-satree")[0]);
            if (mathNode) {
              if (mathNode.tagName == "math") {
                content = satree.TreeRenderer.CannotSummarizeSymbol
              }
              else {
                content = "<math>" + mathNode.cloneNode(true).innerHTML + "</math>";
              }
            }
            else {
              content = satree.TreeRenderer.CannotSummarizeSymbol;
            }
            node.name = content;
          }

          label.id = node.id;
          label.innerHTML = node.name;
          label.onclick = function () {
            that._tree.onClick(node.id);
          };
          //set label styles
          var style = label.style;
          // style.width = 30 + 'px';
          //style.height = 17 + 'px';
          style.cursor = 'pointer';
          style.color = '#333';
          style.fontSize = '13px';
          style.textAlign = 'center';
          style.padding = '10px 0 0 16px';
          style.fontWeight = 'bold';
        },

        //This method is called right before plotting
        //a node. It's useful for changing an individual node
        //style properties before plotting it.
        //The data properties prefixed with a dollar
        //sign will override the global node style properties.
        onBeforePlotNode: function (node) {

          //add some color to the nodes in the path between the
          //root node and the selected node.
          if (node.selected) {
            node.data.$color = "#D25232";
          }
          else {
            delete node.data.$color;
          }
        },

        //This method is called right before plotting
        //an edge. It's useful for changing an individual edge
        //style properties before plotting it.
        //Edge data proprties prefixed with a dollar sign will
        //override the Edge global style properties.
        onBeforePlotLine: function (adj) {
          if (adj.nodeFrom.selected && adj.nodeTo.selected) {
            adj.data.$color = "#3E73CB";
            adj.data.$lineWidth = 3;
          }
          else {
            delete adj.data.$color;
            delete adj.data.$lineWidth;
          }
        }
      });
      //load json data
      this._tree.loadJSON(json);
      //compute node positions and layout
      this._tree.compute();
      //optional: make a translation of the tree
      this._tree.geom.translate(new $jit.Complex(-200, 0), "current");
      //emulate a click on the root node.
      this._tree.onClick(this._tree.root);
    },

    destroy: function () {
      jQuery(this.getSelector()).html("");
      delete this._spaceTree;
    },

    refresh: function () {
      this.destroy();
      this.render();
    }
  },

  internals: {
    toSpaceTreeJson: function () {
      var jsonTree = this._toSpaceTreeJsonRecursive(this.getTree());
      return jsonTree;
    },

    toSpaceTreeJsonRecursive: function (tree) {
      var jsonNode = {
        id      : tree.getMathId() + '-' + _.uniqueId("satree-"),
        name    : tree.getContent(),
        children: []
      };
      if (!tree.isLeaf()) {
        var children = tree.getChildren();
        var jsChildren = [];
        for (var i = 0; i < children.length; i++) {
          jsChildren.push(this._toSpaceTreeJsonRecursive(children[i]));
        }
        jsonNode.children = jsChildren;
      }
      return jsonNode;
    },

    spaceTree: null


  },

  statics: {
    SpaceTree            : 1,
    CannotSummarizeSymbol: "!Summ"
  }

});