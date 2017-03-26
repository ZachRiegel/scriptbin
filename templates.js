var pythonTemplate = _.template(`
	<div class="splashBar">
		<div class="infoBar">
			<div class="title">
				<div class="pageTitle" contenteditable=True id="title" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false">Untitled</div>
				<div class="postfix">
					.py
				</div>
			</div>
		</div>
		<div class="menuBar">
			<div class="menuItem">
				<button class="ui button compact t-primary" id="run">
					<i class="terminal icon"></i>
					Run
				</button>
			</div>
			<div class="menuItem">
				<button class="ui button compact t-secondary" id="save">
					<i class="save icon"></i>
					Save
				</button>
			</div>
			<div class="menuItem">
				<div class="ui disabled compact search dropdown labeled icon button" id="file">
					<i class="folder icon"></i>
					<div>File</div>
					<div class="menu" id="filebin">
						
					</div>
				</div>
			</div>
			<div class="menuItem">
				<button class="ui button compact" id="share">
					<i class="share icon"></i>
					Share
				</button>
			</div>
			<div class="menuItem">
				<div class="ui dropdown labeled search icon button compact" id="theme-selector">
					<i class="paint brush icon"></i>
					<div>Theme</div>
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
		<div class="leftPanel" id="editor">
		</div>
		<div class="handle"></div>
		<div class="rightPanel">
			<div id="console">
			</div>
		</div>
	</div>
`);
var fileTemplate = _.template(`
	<div class="item" data-value="<%= filename %>">
		<div class="align-center">
			<div class="emphasis1"><%= filename %>.py</div>
			<div class="right">
				<button class="ui mini compact red icon button delete-button" data-value="<%= filename %>">
					<i class="trash icon"></i>
				</button>
			</div>
		</div>
	</div>
`);