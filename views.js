var stdin=null;
var vm=null;
var jqconsole=null;
var ticking=0;
var counter=1;
var codeLines=[];
var _escape= function(value) {
  return value.replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}
var setup=`import js
def readPrompt():
	global _inputQueue
	if len(_inputQueue)>0:
		return _inputQueue.pop(0)
	return None

def prompt(text):
	global _inputQueue
	js.eval('''
		ticking+=1;
		jqconsole.SetPromptLabel(\\"'''+text+'''\\", \\'jqconsole-output\\');
		jqconsole.Prompt(true, function (input) {
			 var code=\\"_inputQueue.append(\\\\"\\"+input+\\"\\\\")\\";
			 console.log(code);
			 code=_escape(code);
			 console.log(code);
			 code=\\"r = _internalConsole.push(\\\\'\\" + code  + \\"\\\\')\\";
			 console.log(code);
			 vm._execute_source(code);
			 ticking-=1;
			 vm.tick();
		});
	''');

_markerDict={}

def marker(name):
	global _markerDict
	_markerDict[name]=str(js.eval(\'counter\'))

def goto(marker):
	global _markerDict
	js.eval('''counter='''+_markerDict[marker]+''';''')

def skip():
	pass

\n`.split("\n");

var pythonView = Backbone.View.extend({
	verbose_exec: function(code, init_run) {
		view=this;
		var init_start = new Date();
		vm = new pypyjs();
		// Send all VM output to the console.
		vm.stdout = vm.stderr = function(data) {
			jqconsole.Write(data, 'jqconsole-output');
		}
		var pseudo_status = setInterval(function(){ vm.stdout("."); }, 500);
		vm.ready().then(function() {
			vm.tick=function(){
				vm=this;
				var code = 'r = _internalConsole.push(\'' + _escape(codeLines[counter-1]) + '\')';
				console.log(codeLines[counter-1]);
				counter+=1;
				vm._execute_source(code);
				if(counter<codeLines.length&&ticking==0){
					setTimeout(function(){ vm.tick(); }, 0);
				}
			}
			jqconsole.Reset();
			clearInterval(pseudo_status);
			vm.loadModuleData("code");
			vm._execute_source("import code");
			vm._execute_source("_internalConsole = code.InteractiveConsole(top_level_scope)");
			vm._execute_source("r = _internalConsole.push(\'_inputQueue=[]\')");
			codeLines=setup;
			codeLines=codeLines.concat(code.split("\n"),["",""]);
			console.log(codeLines);
			counter=1;
			vm.tick();
		}, function(err) {
			jqconsole.Write('ERROR: ' + err);
		});
	},
	initialize: function(){
		view=this;
		this.$el.html(pythonTemplate());
		$('.handle').drags();
		var editor = CodeMirror($('#editor')[0], {
			value: "print(\"Hello World!\")",
			mode: {
	            name: "text/x-python",
	            version: 2,
	            singleLineStringErrors: false
	        },
			indentUnit: 4,
			indentWithTabs: true,
			lineWrapping: true,
			lineNumbers: true,
			autoRefresh: true
		});
	    // Global vars, for easy debugging in console.
	    jqconsole = $('#console').jqconsole('', '>>> ');
	    $("#run").click(function() {
	        jqconsole.Reset();
	        jqconsole.Write('exec...', 'jqconsole-output');
	        var code=editor.getValue();
	        view.verbose_exec(code, init_run=false);
	    });

	    // Display a helpful message and twiddle thumbs as it loads.
	    jqconsole.Write('Loading PyPy.js.\n\n', 'jqconsole-output');
	    jqconsole.Write('It\'s big, so this might take a while...', 'jqconsole-output');

	    view.verbose_exec(
	        'print "Welcome to PyPy.js!\\n";import sys;print "Python v"+sys.version',
	        init_run=true
	    );
	    editor.refresh();
	}
});