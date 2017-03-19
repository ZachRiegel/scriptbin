importScripts('pypyjs/FunctionPromise.js');
importScripts('pypyjs/pypyjs.js');

stdinQueue=[]

onmessage = function(event){
	data=event.data;
	switch(data.cmd) {
		case 'input':
			stdinQueue.push(data.msg);
		case 'code':
			code=data.msg;
			vm = new pypyjs();
			// Send all VM output to the console
			var init_start = new Date();
			vm.stdout = vm.stderr = function(data) {
				postMessage({'cmd': 'output', 'msg': data})
			}
			vm.stdin = function() {
				console.log("Called new stdin function");
				var promise = new Promise(function(resolve, reject) {
					jqconsole.Prompt(true, function(input){
						resolve(input);
					});
				});
				return promise;
			}
			var pseudo_status = setInterval(function(){ vm.stdout("."); }, 500);
			vm.ready().then(function() {
				var duration = new Date() - init_start;
				$("#run_info").text("PyPy.js init in " + duration);
				clearInterval(pseudo_status);
				jqconsole.Reset();
				// console.log("Start code:" + JSON.stringify(code));
				var start_time = new Date();
				vm.exec(code).then(function() {
			        if (init_run!=true) { // don't overwrite "PyPy.js init in..." info
			            var duration = new Date() - start_time;
			            $("#run_info").text("Run in " + duration + " (OK)");
			        }
				}, function (err) {
			        // err is an instance of pypyjs.Error
			        var duration = new Date() - start_time;
			        $("#run_info").text("Run in " + duration + " ("+err.name+": "+err.message+"!)");
			        vm.stderr(err.trace); // the human-readable traceback, as a string
				});
			}, function(err) {
				jqconsole.Write('ERROR: ' + err);
			});
	}
}