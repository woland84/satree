/**
 * Manages the displays of trees
 * @author <a href="mailto:alex@flanche.net">Alex Dumitru</a>
 * @author <a href="mailto:vlad@flanche.net">Vlad Merticariu</a>
 */

FlancheJs.defineClass("satree.Manager", {

  init: function (selector) {
    this.setSelector(jQuery(selector).find(this.getSelector()));
  },

  properties: {
    selector      : {
      value: 'math'
    },
    showForAllMath: {
      value: true
    },
    mathMode      : {
      value: satree.MathParser.ModeApply
    },

    summarizeLabels : {
      value : false
    }
  },

  methods: {
    run: function () {
      this._highlightAmbiguity();
    },
    stop: function() {
      this._unhighlightAmbiguity(); 
    }
  },

  internals: {
    highlightAmbiguity: function () {
      $(this.getSelector()).each(function () {
        $(this).wrap('<span>');
        $(this).parent().css('cursor', 'pointer');
        if ($(this).find('csymbol[cd="cdlf"]').length) { //we found an ambiguous statement
          $(this).parent().css('background-color', '#ffff99');
        }
      });
    },
    unhighlightAmbiguity: function() {
      $(this.getSelector()).each(function(){
        $(this).unwrap(); 
      })
    },
    listenerFunction: function (self) {
      $(this).parent().css('color', 'blue');
      var id = this.getAttribute("id");
      var formulaDiv = document.createElement('div');
      formulaDiv.appendChild(document.getElementById(id).cloneNode(true));
      var formula = formulaDiv.innerHTML;
      var parser = new satree.MathParser(id, satree.ConfigManager.getRenderMode());
      var mathTree = parser.parse();
      var disambiguator = new satree.Disambiguator(mathTree);
      var generatedTrees = disambiguator.generateTrees();
      var panel = new satree.Panel(id, formula, generatedTrees);
      panel.render();
    }
  }
});


