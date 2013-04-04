(function($){

  $(document).ready(function(){

    var id = "1.p1.1.m2.1";
    //var id = "S0.Ex1.m1.1";
    //var id = "1.p1.2.m1.1";
    parser = new satree.MathParser(id, satree.MathParser.ModeApply);
    stree = parser.parse();
    dis = new satree.Disambiguator(stree);
    distr = dis.generateTrees();
//    window.treee.forEach(function(node){
//      $("body").append(node.getContent());
//    })
//
//    console.log(distr);
//
//    renderer = new satree.TreeRenderer(stree, "#infovis");
//    renderer.render();
//    renderer = new satree.TreeRenderer(distr[0], "#infovis2");
//    renderer.render();
//    renderer = new satree.TreeRenderer(distr[1], "#infovis3");
//    renderer.render();


  })

})(jQuery);