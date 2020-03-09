export class BasicTimer {

    constructor(timeout, onComplete) {
        this._timeout = timeout;
        this._onComplete = onComplete;
        this.isOn = false;
        this._timer = undefined;
    }

    // Start the timer. Data passed to completion handler on timeout
    begin(data) {
        this._timer = setTimeout(() => { 
            this._execute(data) 
        }, this._timeout);

        this.isOn = true;
    }

    // Internal function. Calls the completion handler
    _execute(data) {
        this.cancel();
        this._onComplete(data);
    }

    // Stops the timer
    cancel() {
        if (this._timer != undefined) clearTimeout(this._timer);
        this.isOn = false;
        this._timer = undefined;
    }

}

export class UpdateTimer extends BasicTimer {

    constructor(timeout, onComplete) {
        super(timeout, onComplete);
        this._mostRecentData = undefined;
    }

    begin(data) {
        this._mostRecentData = data;

        this._timer = setInterval(() => {
            this._execute(data);
        }, this._timeout);

        this.isOn = true;
    }

    // Execution function for the timer
    _execute(data) {
        this._onComplete(data);
    }

    // Calls the completion handler and restarts the timer
    fire(data) {
        this.cancel();
        this._execute(data);
        this.begin(data);
    }

    // Cancels the current timer and restarts it
    reset() {
        this.cancel();
        this.begin(this._mostRecentData);
    }

    cancel() {
        if (this._timer != undefined) clearInterval(this._timer);
        this._mostRecentData = undefined;
        this.isOn = false;
        this._timer = undefined;
    }
    
}