var pythonTemplate = _.template(`
	<div class="splashBar">
		<div class="infoBar">
			<div class="title">
				<div class="pageTitle" contenteditable=True>
					Untitled
				</div>
				<div class="postfix">
					.py
				</div>
			</div>
		</div>
		<div class="menuBar">
			<div class="item">
				<button class="ui button compact t-primary" id="run">
					<i class="terminal icon"></i>
					Run
				</button>
			</div>
			<div class="item">
				<button class="ui button compact t-secondary" id="save">
					<i class="save icon"></i>
					Save
				</button>
			</div>
			<div class="item">
				<button class="ui button compact" id="open">
					<i class="folder icon"></i>
					Open File
				</button>
			</div>
			<div class="item">
				<button class="ui button compact" id="export">
					<i class="share icon"></i>
					Share
				</button>
			</div>
			<div class="item">
				<div class="ui dropdown labeled search icon button compact" id="theme-selector">
					<i class="paint brush icon"></i>
					<div>Choose Theme</div>
					<div class="menu">
						<div class="item active selected" data-value="defaultTheme.css">Default</div>
						<div class="item" data-value="coffeeTheme.css">Coffee</div>
						<div class="item" data-value="nocturnalTheme.css">Nocturnal</div>
					</div>
				</div>
			</div>
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