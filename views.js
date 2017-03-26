var stdin=null;
var vm=null;
var jqconsole=null;
var ticking=0;
var counter=1;
var codeLines=[];
var theme='default';
var docList=null;
var canStore=false;
var editor=null;
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
			 code=_escape(code);
			 code=\\"r = _internalConsole.push(\\\\'\\" + code  + \\"\\\\')\\";
			 vm._execute_source(code);
			 ticking-=1;
			 if(counter<codeLines.length&&ticking==0){
					setTimeout(function(){ vm.tick(); }, 0);
			 }
		});
	''');

_anchorDict={}

def anchor(name):
	global _anchorDict
	_anchorDict[name]=str(js.eval(\'counter\'))

def goto(marker):
	global _markerDict
	js.eval('''counter='''+_anchorDict[marker]+''';''')

def skip():
	pass

\n`.split("\n");

var pythonView = Backbone.View.extend({
	testStorage: function(){
	    var test = 'test';
	    try {
	        localStorage.setItem(test, test);
	        localStorage.removeItem(test);
	        return true;
	    } catch(e) {
	        return false;
	    }
	},
	updateOpenFile: function(){
		if(docList.length>0){
			$('#filebin').html('');
			_.each(docList, function(title){
				$('#filebin').append(fileTemplate({filename: title}));
			});
			$('.delete-button').click(function(e){
				e.stopPropagation();
				title=$(this).data('value');
				if(confirm("Are you sure you want to delete \""+title+".py\"?")){
					index=$.inArray(title, docList);
					if(index>=0){
						docList.splice(index, 1);
					}
					localStorage.removeItem('file-'+title);
				}
				view.updateOpenFile();
			});
			$('#file').removeClass('disabled');
		}
		else{
			$('#file').addClass('disabled');
		}
	},
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
				vm._execute_source(code);
				counter+=1;
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
			counter=1;
			vm.tick();
		}, function(err) {
			jqconsole.Write('ERROR: ' + err);
		});
	},
	initialize: function(){
		view=this;
		this.$el.html(pythonTemplate());

		canStore=view.testStorage();

		//enable middle handle
		$('.handle').drags();

		//disable newline in file title
		$("#title").keypress(function(e){ return e.which != 13; });

		//set color scheme changer
		$('#theme-selector')
			.dropdown({
				onChange: function(value, text, $selectedItem) {
				 	$('#theme').attr('href', value);
				 	//update key if we can
				 	if(canStore){
				 		localStorage.setItem("theme", value);
				 	}
				}	
			});

		//enable editor
		editor = CodeMirror($('#editor')[0], {
			value: `# There are some minor differences between this and standard python 2.7.9
# These differences are summarized in the following code snippets.
# It is highly encouraged that you do a quick readthrough

# Due to running in a javascript environment the "input()" and "raw_input()" commands will block indefinitely
# This means that we have two new functions "prompt()" and "readPrompt()" for standard io operations
# These functions only work on lines that are not indented in any way.
prompt("Enter your name: ") # line is not indented, code executes
#	prompt("Enter thing: ") # This would error
name=readPrompt()
print "Hello", name+"!"

# Wait, I'm writing a program with an input driven loop. How do I do this without indenting?
# To solve this problem we now have the functions "anchor(label)" and "goto(label)"
# When you call goto it will continue to execute the program at the last anchor with the same label
# These functions have undefined behavior if they are on a line that is indented
l=[]
anchor('some anchor')
prompt("Enter a number, 0 to quit: ")
val=int(readPrompt())
l.append(val) if val!=0 else skip() #skip() is a placeholder function that does nothing, it is also new
goto('some anchor') if val!=0 else skip()
print 'The sum of the numbers is:', sum(l)

# An excessive use of goto and anchor functions can make programs really, really hard to read
# However, they only need to be used when dealing with prompt/readPrompt
# When you are not using these functions you may use python's normal control structures
# We are going to draw a mandelbrot set to demonstrate
print "\\"Pathological monsters!\\" cried a terrified mathematician."
minX = -2.0
maxX = 1.0
width = 90
height = 30
aspectRatio = 2
chars = " .,-:;i+hHM$*#@ "
yScale = (maxX-minX)*(float(height)/width)*aspectRatio
for y in range(height):
    line = ""
    for x in range(width):
        c = complex(minX+x*(maxX-minX)/width, y*yScale/height-yScale/2)
        z = c
        for char in chars:
            if abs(z) > 2:
                break
            z = z*z+c
        line += char
    print line

# See this ^ blank line? It is required to have a blank line after every indented block
# If you delete this blank line, a syntax error will occur.
# If this line contains only a tab (or other whitespace) the program will error. Be careful!
print 'Done!'
# That's all there is in terms of differences! Code away!`,
			mode: {
	            name: "text/x-python",
	            version: 2,
	            singleLineStringErrors: false
	        },
			indentUnit: 4,
			indentWithTabs: true,
			lineWrapping: true,
			lineNumbers: true,
			autoRefresh: true,
			scrollbarStyle: "native",
			viewportMargin: Infinity,
			theme: "base"
		});

	    // Enable console
	    jqconsole = $('#console').jqconsole('', '>>> ');

	    //enable button to run code
	    $("#run").click(function() {
			//view.save();
	        jqconsole.Reset();
	        jqconsole.Write('exec...', 'jqconsole-output');
	        var code=editor.getValue();
	        view.verbose_exec(code, init_run=false);
	    });

	    //enable button to get shareable link
	    $("#share").click(function(){
			var code=escape(LZString.compress(editor.getValue()));
			prompt('Use this link to share your code:',window.location.protocol + "//cthaehapp.com/"+'?title='+$('#title').text() + '&code='+code);
	    });

		//if we have the ability to store things locally, enable store-y things
		if(canStore){
			//enable file browser functionality
			$('#file')
			.dropdown({
				onChange: function(value, text, $selectedItem) {
					$("#title").text(value);
					editor.getDoc().setValue(LZString.decompress(localStorage.getItem('file-'+value)));
				}
			});
			theme=localStorage.getItem("theme");
			if(theme!=null){
				$('#theme-selector')
					.dropdown('set selected', theme);
			}

			//set up tracker of which files the user owns

			docListTemp=localStorage.getItem("docList");
			if(docListTemp==null){
				docList=[];
			}
			else{
				docList=JSON.parse(LZString.decompress(docListTemp));
			}
			//save the current file when we click
			$('#save').click(function(){
				title=$('#title').text();
				if(title==="Untitled"){
					title='quicksave';
					$('#title').text(title);
				}
				index=$.inArray(title, docList);
				if(index>=0){
					docList.splice(index, 1);
					docList.unshift(title);
				}
				else{
					docList.unshift(title);
				}
				try {
					localStorage.setItem("file-"+title, LZString.compress(editor.getValue()));
					view.updateOpenFile();
				} catch (e) {
					if (e == QUOTA_EXCEEDED_ERR) {
						alert('We don\'t have space to store this! Perhaps delete some of your other files?');
					}
					else{
						alert("The save went wrong somewhere.");
					}
					return false;
				}
				return true;
			});
			//save list of files on exit
			$( window ).on('unload', function() {
					$('#save').trigger('click');
				localStorage.setItem("docList", LZString.compress(JSON.stringify(docList)));
			});
			//attach list of files we know exist to the file selector
			view.updateOpenFile();
		}
		else{
			$("#save").addClass("disabled");
			$("#file").addClass("disabled");
			alert("Local storage not available. You will not be able to save or open files.");
		}
		//if query string exists and has code action
		var urlParams = new URLSearchParams(window.location.search);
		if(urlParams.has('code')&&urlParams.has('title')){
			//we have a code snippet in the url
			var code='#The file formerly known as '+urlParams.get('title')+'\n';
			code+=LZString.decompress(unescape(urlParams.get('code')));
			$("#title").text('shared');
					editor.getDoc().setValue(code);
			//remove query string from url
		    var newurl = window.location.protocol + "//" + window.location.host + window.location.pathname;
			window.history.pushState({path:newurl},'',newurl);
		}

	    // Display a helpful message and twiddle thumbs as it loads.
	    jqconsole.Write('Loading Python environment\n\n', 'jqconsole-output');
	    jqconsole.Write('This may take a bit...', 'jqconsole-output');

	    view.verbose_exec(
	        'import sys;print "Python v"+sys.version',
	        init_run=true
	    );
	    editor.refresh();
	}
});