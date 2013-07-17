/**
 * Builds the library into a single file
 * @author <a href="mailto:alex@flanche.net">Alex Dumitru</a>
 * @author <a href="mailto:vlad@flanche.net">Vlad Merticariu</a>
 */

var gear = require('gear');
var gear_lib = require('gear-lib');

var LibPath = 'lib';
var SrcPath = 'src';

var JsSrcFiles = [
  'Util.js',
  'Tree.js',
  'MathParser.js',
  'ConfigManager.js',
  'Disambiguator.js',
  'TreeRenderer.js',
  'Panel.js',
  'Manager.js'
];

var JsLibFiles = [
  "Flanche/FlancheJs.js",
  "bootstrap/js/bootstrap.min.js",
  "Jit/spaceTree.js"
];

var CSSSrcFiles = [
  'panel.css'
];

var CSSLibFiles = [
  'bootstrap/css/bootstrap.min.css',
  'Jit/spaceTree.css'
];

function buildJsFiles(libPath, libFiles, srcPath, srcFiles, debug) {
  debug = debug || false;
  var absLibPaths = libFiles.map(function (relPath) {
    return './' + libPath + '/' + relPath;
  });
  var absSrcPaths = srcFiles.map(function (relPath) {
    return './' + srcPath + '/' + relPath;
  });
  var allFiles = absLibPaths.concat(absSrcPaths);
  allFiles.unshift('./' + srcPath + '/' + "JOBAD_pre.js"); 
  allFiles.push('./' + srcPath + '/' + "JOBAD_post.js"); 

  var build = new gear.Queue({registry: new gear.Registry({module: 'gear-lib'})})
    .log("#Building the Javascript dist file")
    .read(allFiles)
    .concat();

  if (!debug) {
    build = build.log("#Minifying files")
      .jsminify({
        config: {
          mangle: true
        }
      })
      .log("#Writing to ./dist/satree.min.js")
      .write("./dist/satree.min.js");
  }
  else {
    build = build.log("#Writing to ./dist/satree.debug.js")
      .write("./dist/satree.debug.js");
  }
  build.run(function (error, results) {
    if (error) {
      console.log(error);
      throw Error("#Build process failed!\n");
    }
    else {
      console.log("#Javascript files successfully built.");
    }
  });
}

function buildCssFiles(libPath, libFiles, srcPath, srcFiles, debug) {
  debug = debug || false;
  var absLibPaths = libFiles.map(function (relPath) {
    return './' + libPath + '/' + relPath;
  });
  var absSrcPaths = srcFiles.map(function (relPath) {
    return './' + srcPath + '/' + relPath;
  });

  var allFiles = absLibPaths.concat(absSrcPaths);
  var build = new gear.Queue({registry: new gear.Registry({module: 'gear-lib'})})
    .log("#Building the CSS dist file")
    .read(allFiles)
    .concat();

  if (!debug) {
    build = build.log("#Minifying files")
//      .cssminify() //TODO see why the cssminifier throws an error
      .log("#Writing to ./dist/satree.min.css")
      .write("./dist/satree.min.css");
  }
  else {
    build = build.log("#Writing to ./dist/satree.debug.css")
      .write("./dist/satree.debug.css");
  }

  build.run(function (error, results) {
    if (error) {
      console.error(error);
      //throw Error("#Build process failed!");
    }
    else {
      console.log("#CSS files successfully built.");
    }
  });
}

function buildDist(debug) {
  buildCssFiles(LibPath, CSSLibFiles, SrcPath + '/css', CSSSrcFiles, debug);
  buildJsFiles(LibPath, JsLibFiles, SrcPath + '/js', JsSrcFiles, debug);
}

function parseCommands() {
  var debug = false;
  process.argv.forEach(function (value) {
    if (value === "--debug") {
      debug = true;
    }
  });

  buildDist(debug);
}

parseCommands();

