/**
 * @description Parses the mathml into a ftree.Node
 * @author <a href="mailto:alex@flanche.net">Alex Dumitru</a>
 * @author <a href="mailto:vlad@flanche.net">Vlad Merticariu</a>
 * @TODO Split this class into satree.Parser > satree.MathModeParser, satree.ApplyModeParser
 */

FlancheJs.defineClass("satree.MathParser", {

  init: function (mathId, mode) {
    this._mathId = mathId;
    this._mode = mode;
  },

  internals: {
    mathId: null,
    mode  : null,

    /**
     * Returns the html to be displayed in the tree node that is being parsed
     * @param xmlDoc the xml node that is being parsed into a tree node
     * @return {String} the html built
     */
    getMathDisplay: function (xmlDoc) {
      var refId = xmlDoc.getAttribute("xref");
      if (!refId) {
        _.warn("Ref id not found for " + xmlDoc + ". Parsing cannot continue");
        //throw new Error("Ref id not found for " + xmlDoc.textContent + ". Parsing cannot continue");
      }

      var mathDisplay = this._mapElemDisplay(xmlDoc);
      if (mathDisplay == null) {
        var mathNode = document.getElementById(refId);
        if (mathNode && !this._isElemMathTag(xmlDoc)) {
          var serializer = new XMLSerializer();
          mathDisplay = "<math>" + serializer.serializeToString(mathNode.cloneNode()) + "</math>";
        }
        else {
          _.warn("No reference id found for: ", xmlDoc, " Defaulting to textContent || tagName || UnknowSymbol");
          mathDisplay = xmlDoc.textContent || xmlDoc.tagName || this.UnknownSymbol;
        }
      }

      return mathDisplay;
    },

    /**
     * This function tries its best to deal with inconsistencies in the xml documents that
     * are parsed by mapping special parsing cases to special symbols
     * @param xmlDoc the xml node that is being parsed
     * @return {String} the html to be displayed in the node tree
     */
    mapElemDisplay: function (xmlDoc) {
      if (xmlDoc.tagName == "apply") {
        var child = xmlDoc.children[0];
        if (this._mode === satree.MathParser.ModeMath && !(child.tagName == "csymbol" && child.getAttribute("cd") == "cdlf")) {
          xmlDoc.removeChild(xmlDoc.children[0]);
          return this._getMathDisplay(child);
        }
        return satree.MathParser.ApplySymbol
      }
      else if (xmlDoc.tagName == "csymbol") {
        if (!this._isElemMathTag(xmlDoc)) {
          return xmlDoc.textContent;
        }
      }
      return null;
    },

    /**
     * Checks if the xml node referenced by the current parsed node is a math element
     * @param xmlDoc the annotation xml node
     * @return {Boolean}
     */
    isElemMathTag: function (xmlDoc) {
      var refId = xmlDoc.getAttribute("xref");
      var mathNode = document.getElementById(refId);
      return mathNode != null && mathNode.tagName == "math";
    },

    /**
     * Parses an mathml tree into a satree.Tree using the apply mode display
     * i.e. f(a,b) => @ (f,a,b)
     * @return {satree.Node} the generated tree
     */
    parseModeApply: function () {
      var annotXml = document.getElementById(this._mathId).children[0].children[1].cloneNode(true);
      var tree = null;
      return( this._parseModeApplyRecursive(tree, annotXml.children[0]) );
    },

    /**
     * Helper function for parsing the tree in a recursive fashion
     * @param tree the satree.Node element in which to put the parsed nodes
     * @param xmlDoc the xml tree to be parsed
     * @return {satree.Node} the generated satree.Node
     */
    parseModeApplyRecursive: function (tree, xmlDoc) {
      var newNode = null;
      var mathDisplay = this._getMathDisplay(xmlDoc);
      newNode = new satree.Node(mathDisplay);
      newNode.setMathId(xmlDoc.getAttribute("xref"));
      this._tagCdlfNodes(newNode, xmlDoc);
      if (tree == null) {
        tree = newNode;
      }
      else {
        newNode.setParent(tree);
      }

      var self = this;
      _.each(xmlDoc.children, function (child) {
        self._parseModeApplyRecursive(newNode, child);
      });

      return tree;
    },

    /**
     * Tags all children of elements containing a cdlf child as ambiguous so that
     * a Disambiguator can recognize them
     * @param tree the satree.Node to be tagged
     * @param xmlNode the xml node to be checked
     */
    tagCdlfNodes: function (tree, xmlNode) {
      if(xmlNode.getAttribute("cd") == "cdlf"){
        tree.setTag("ambiguous");
      }
    },

    parseModeMath: function () {
      var annotXml = document.getElementById(this._mathId).children[0].children[1].cloneNode(true);
      var tree = null;
      tree = this._parseModeApplyRecursive(tree, annotXml.children[0]);
      return tree;
    },

    removeFirstNodeFromEachLevel: function (tree) {
      var children = tree.getChildren();
      if (children.length > 0) {
        tree.removeChild(children[0]);
        children = tree.getChildren();
        for (var i = 0; i < children.length; i++) {
          this._removeFirstNodeFromEachLevel(children[i]);
        }
      }
    }

  },

  statics: {
    //enums for modes
    ModeApply    : 1,
    ModeMath     : 2,
    //the display of an apply symbol
    ApplySymbol  : "@",
    //the display of an unknown symbol
    UnknownSymbol: "USym"
  },

  methods: {
    /**
     * Parses the mathml content and returns a generated satree.Node tree
     * @return {satree.Node}
     */
    parse: function () {
      if (this._mode === this.ModeApply) {
        return this._parseModeApply();
      }
      else if (this._mode === this.ModeMath) {
        return this._parseModeMath();
      }
      else {
        throw new Error("Please provide a valid parsing model");
      }
    }
  }

})
