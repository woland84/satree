/**
 * Manages the displays of trees
 * @author <a href="mailto:alex@flanche.net">Alex Dumitru</a>
 * @author <a href="mailto:vlad@flanche.net">Vlad Merticariu</a>
 */

FlancheJs.defineClass("satree.Manager", {

  init: function (selector) {
    this.setSelector($(selector).find(this.getSelector()));
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

    showControls: {
      value: true
    },

    summarizeLabels : {
      value : false
    }
  },

  methods: {
    run: function () {
      this._highlightAmbiguity();
      this._listenOnMathClick();
      if (this.getShowControls()) {
        this._addControls();
      }
    },
    stop: function() {
      if (this.getShowControls()) {
        this._removeControls();
      }
      this._unlistenOnMathClick(); 
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
    listenOnMathClick: function () {
      var self = this;
      if (this.getShowForAllMath()) {
        $(this.getSelector()).click(function () {
          self._listenerFunction.call(this, self);
        })
      }
      else {
        $(this.getSelector()).filter(":has(csymbol[cd='cdlf'])").click(function () {
          self._listenerFunction.call(this, self);
        })
      }
    },
    unlistenOnMathClick: function () {
       $(this.getSelector()).off("click"); 
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
    },

    addControls: function () {
      var self = this;
      var controlTemplate = "<div id='satree-math-controls'><h2>Disambiguator Options</h2>" +
        "Tree Display: <br/>" +
        "<input type='radio' name='satree-math-mode' value='1' checked> Apply Mode</input><br />" +
        "<input type='radio' name='satree-math-mode' value='2'> Math Mode</input><br/>" +
        "<input type='checkbox' name='satree-summarized-mode' /> Summarize Math" +
        "</div>";
      $("body").append(controlTemplate);
      $("input[name='satree-math-mode']").change(function () {
        var mode = $("input[name='satree-math-mode']:checked").val();
        if (mode == 1) {
          satree.ConfigManager.setRenderMode(satree.MathParser.ModeApply);
        }
        else {
          satree.ConfigManager.setRenderMode(satree.MathParser.ModeMath);
        }
      })
      $("input[name='satree-summarized-mode']").change(function(){
        var checked = false;
        if($(this).prop("checked")){
          checked = true;
        }
        satree.ConfigManager.setSummarizedMode(checked);
      })
    },
    removeControls: function(){
      $(document.getElementById("satree-math-controls")).remove(); 
    }
  }
});


