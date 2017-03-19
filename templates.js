var pythonTemplate = _.template(`
	<div class="menuBar">
		<div class="menuItem">
			<button class="ui button blue compact" id="run">
				<i class="terminal icon"></i>
				Run
			</button>
		</div>
	</div>
	<div class="divider">
		<div class="leftPanel">
			<div class="full" id="editor"></div>
		</div>
		<div class="handle"></div>
		<div class="rightPanel">
			<div id="console">
			</div>
		</div>
	</div>
`);