Formula Tree Viewer
===================

Description
-----------
Javascript library that allows display of math formulas in Context MathML as trees for disambiguation.


Build
-----
To build from the sources you will need [nodejs](http://nodejs.org/) installed on your system. 
Please follow the instructions on the nodejs website to install it correctly

Then install the dependencies for the build system

```
[user@host]$cd ~/satree   #assuming satree the folder containing the code  
[user@host]$npm install  
```

Next run the build system

```
[user@host]$node build.js    #you can add --debug to build it for debug mode (i.e no comments stripped, code not minified)  
```

You should now have two files in the dist/ folder called satree.min.js and satree.min.css which are the minified versions
of the src

Please note that dist/ already contains the built version of the library so there's no need to rebuild if you have not changed
anything in the source

Deploy
------
To deploy the script all you have to do is include it alongside the css and start the manager on some HTMLElement. For example:


```html
	<link href="../dist/satree.debug.css" rel="stylesheet" type="text/css" />
	<script type="text/javascript" src="../dist/satree.debug.js"></script>

    <script type="text/javascript">
        jQuery(document).ready(function(){
            var manager = new satree.Manager("body"); //This will mark any mathml elements under body
            manager.run();					
        });
	</script>
```

Configuration
-------------
You can configure several features of the library using the ConfigManager object. All configuration options are documented
in the class file.
You should usually set up your configuration before calling the run method of the Manager object, although you can always
change them during runtime and refresh the Manager.

Server-side
-----------
The results of the disambiguation action are always sent to a server specified by the user using the POST HTTP method.
The format is the following

```json
  {
    "correct" : "Boolean" //true/false depending on the user's choice
    "id"      : "String"  //the id of the math element that was disambiguated
    "formula" : "String"  //the MathMl contents of the examined node
    "tree"    : "Json"    //the json representation of the tree built to represent the MathMl
  }
```

To set the url to which the result is sent use the ConfigManger e.g.:
```Javascript
  satree.ConfigManager.setSubmitUrl("http://host/contextPath");
```

There is a simple php script under src/php that you can use as an example.

Issues
------
If you encounter any issues please submit a bug report at https://github.com/woland84/satree/issues


Live Example
------------
You can find a live example [here](http://kwarc.flanche.net/mathViewer)

Credits
-------
This library uses the following third-party libraries:  
Twitter Bootstrapt - Apache License  
FlancheJs 		   - MIT License  
jQuery			   - MIT License  
Underscorejs	   - MIT License  
JIT SpaceTree 	   - MIT License  
