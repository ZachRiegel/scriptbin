var pythonView = Backbone.View.extend({
	initialize: function(){
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
	}
});