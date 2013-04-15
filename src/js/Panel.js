/**
 * Defines a pannel which contains a tree
 * @author <a href="mailto:alex@flanche.net">Alex Dumitru</a>
 * @author <a href="mailto:vlad@flanche.net">Vlad Merticariu</a>
 */

FlancheJs.defineClass("satree.Panel", {

  init: function (id, formula, trees) {
    this.$formula = formula;
    this.$trees = trees;
    this.$id = id;
    this._json = new Array(trees.length);
  },

  properties: {
    formula: {},
    trees  : {},
    id     : {}
  },

  methods: {
    render: function () {
      var treeString = '';
      trees = this.getTrees();
      for (var i = 0; i < trees.length; i++) {
        treeString += '<div class="tree-div">' +
          '<div class="tree-div-header">' +
          '<button id="success-' + i + '" class="tree-ok btn btn-success">OK</button>' +
          '<button id="fail-' + i + '" class="tree-fail btn btn-danger">Incorrect</button>' +
          '</div>' +
          '<div class="tree" id="tree-' + i + '"></div><textarea class="text-tree" id="text-' + i + '">Comment...</textarea></div>';
      }
      var modal = '<div id="myModal" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">' +
        '<div class="modal-header">' +
        this.getFormula() +
        '</div>' +
        '<div class="modal-body">' +
        treeString +
        '</div>' +
        '<div class="modal-footer">' +
        '<button id="myModal-close" class="btn" data-dismiss="modal" aria-hidden="true">Close</button>' +
        '</div>' +
        '</div>';
      $('body').append(modal);
      $("#myModal").modal();
      var self = this;
      var postCallback = function (success) {
        ok_id = $(this).attr('id').split("-");
        ok_id = ok_id[1];
        $.post(satree.ConfigManager.getSubmitUrl(), {'correct': success, 'id': self.getId(), 'formula': self.getFormula(), 'tree': self._json[i]});
        $('#myModal-close').click();
      }
      $('.tree-ok').click(function () {
        postCallback(true);
      })
      $('.tree-fail').click(function () {
        postCallback(false);
      })
      //set pannel width
      $('.tree-div').css('width', ((100 / i) - 1) + '%');
      //set border if not last
      var count = 0;
      $('.modal').css('width', screen.width * 0.9);
      $('.modal').css('margin-left', -0.9 * screen.width / 2);
      $('.modal').css('height', screen.height * 0.7);
      $('.modal-body').css('max-height', 'none');
      $('.tree').css('height', screen.height * 0.7 - 220);
      $('.text-tree').css('margin-left', '5px');
      $('.tree').css('width', (screen.width * 0.85) / trees.length);
      $('.tree-div').each(function () {
        count++;
        if (count == trees.length) {
          return false;
        }
        else {
          $(this).css('border-right', '1px solid #000');
        }
      })

      setTimeout(function () {
        for (i = 0; i < trees.length; i++) {
          var renderer = new satree.TreeRenderer(trees[i], "#tree-" + i);
          self._json[i] = renderer._toSpaceTreeJson();
          renderer.render();
        }
      }, 200);

      $('#myModal').on('hidden', function () {
        $('#myModal').remove();
        $('.modal-backdrop').remove();
      })
    }
  },

  internals: {
    json: {}
  }

});
