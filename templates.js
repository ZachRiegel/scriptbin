var pythonTemplate = _.template(`
	<div class="menuBar">
		<button class="ui button compact">
			<i class="terminal icon"></i>
			Run
		</button>
	</div>
	<div class="divider">
		<div class="tomato">
			<div class="full" id="editor"></div>
		</div>
		<div class="handle"></div>
		<div class="blue">
		</div>
	</div>
`);