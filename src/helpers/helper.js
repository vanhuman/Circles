export class Helper {
    static taskConstructor = function (funcArg, waitArg) {
        var task = {
            wait: waitArg, // wait time every loop
            func: funcArg, // function to execute every loop
            running: true,
            timeout: false, // variable that holds the setTimeout
            start: function () {
                this.running = true;
                return this.loop();
            },
            loop: function () {
                this.timeout = setTimeout(this.runLoop, this.wait);
                return this;
            },
            runLoop: function () {
                var result;
                if (!task.running) return;
                result = task.func.call(task);
                if (typeof result == 'number') {
                    if (result === 0) return;
                    task.wait = result;
                }
                task.loop();
            },
            stop: function () {
                this.running = false;
                clearTimeout(this.timeout);
            }
        };
        return task.start();
    };
}
