export class BasicTimer {

    constructor(timeout, onComplete) {
        this.timeout = timeout;
        this.onComplete = onComplete;
        this.isOn = false;
        this.timer = undefined;
    }

    // Start the timer. Data passed to completion handler on timeout
    begin(data) {
        this.timer = setTimeout(() => { 
            this.execute(data) 
        }, this.timeout);

        this.isOn = true;
    }

    // Internal function. Calls the completion handler
    execute(data) {
        this.cancel();
        this.onComplete(data);
    }

    // Stops the timer
    cancel() {
        if (this.timer != undefined) clearTimeout(this.timer);
        this.isOn = false;
        this.timer = undefined;
    }

}

export class UpdateTimer extends BasicTimer {

    begin(data) {
        this.cancel();
        this.mostRecentData = data;
        super.begin(data);
    }

    // Calls the completion handler and restarts the timer
    fire(data) {
        this.mostRecentData = data;
        this.execute(data);
    }

    // Calls the completion handler and makes the timer repeat
    execute(data) {
        this.onComplete(data);
        this.begin(data);
    }

    // Cancels the current timer and restarts it
    reset() {
        this.begin(this.mostRecentData);
    }
    
}