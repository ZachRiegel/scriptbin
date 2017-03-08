var pythonTemplate = _.template(`
	<div class="menuBar">
		<button class="ui button compact">
			<i class="terminal icon"></i>
			Run
		</button>
	</div>
	<div class="divider">
		<div class="tomato">
			<textarea id="editor">print('Hello World!')</textarea>
		</div>
		<div class="handle"></div>
		<div class="blue">
		</div>
	</div>
`);