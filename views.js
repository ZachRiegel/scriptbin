var pythonView = Backbone.View.extend({
	initialize: function(){
		this.render();
	},
	render: function(){
		this.$el.append(pythonTemplate());
		hljs.configure({   // optionally configure hljs
			languages: ['python']
		});
		$('.handle').drags();
		var myCodeMirror = CodeMirror.fromTextArea($('#editor')[0], {
			mode: {
	            name: "text/x-python",
	            version: 2,
	            singleLineStringErrors: false
	        },
			indentUnit: 4,
			indentWithTabs: true,
			lineWrapping: true,
			lineNumbers: true
		});
	}
});