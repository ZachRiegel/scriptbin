'''import sys, StringIO, js
class fifoFile(object):
	buffer=StringIO.StringIO()
	def readline(self):
		self.buffer.seek(0)
		line = self.buffer.readline()
		self.buffer.buf=self.buffer.buf[len(line):]
		self.buffer.read()
		return line

sys.stdin = fifoFile()
stdinwrapper=js.Function(sys.stdin.buffer.write)
js.globals["vm"].stdin=stdinwrapper'''
import js
def inputJS(text):
	prompt=js.globals.prompt
	return prompt(text, "")

def readInput():
	global _inputQueue
	if len(_inputQueue)>0:
		return _inputQueue.pop(0)
	return None

def promptInput(text):
	global _inputQueue
	js.eval('''
		ticking+=1;
		jqconsole.Write(\"'''+text+'''\", \'jqconsole-output\');
		jqconsole.SetPromptLabel(\"\");
		jqconsole.Prompt(true, function (input) {
			 var code=\"_inputQueue.append(\\"\"+input+\"\\")\";
			 console.log(code);
			 code=_escape(code);
			 console.log(code);
			 code=\"r = _internalConsole.push(\\'\" + code  + \"\\')\";
			 console.log(code);
			 vm._execute_source(code);
			 ticking-=1;
			 vm.tick();
		});
	''');