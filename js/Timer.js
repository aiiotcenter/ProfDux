class Timer {
    timerValue = 0;
    hours = 0;
    minutes = 0;
    seconds = 0;
    timerInterval;
    timerElement;

    constructor(timerValue, timerElement, callback = () => {}) {
        this.timerValue = timerValue;
        this.timerElement = timerElement;
        this.seconds = timerValue * 60;
        this.callback = callback;
    }

    start() {
        this.setTimerInterval();
    }

    displayTime({ hours, minutes, seconds }) {
        this.timerElement.textContent = `${String(hours).padStart(
            2,
            "0"
        )}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
            2,
            "0"
        )}`;
    }

    reduceTimer() {
        const hours = Math.floor(this.seconds / 60 / 60);
        const minutes = Math.floor(this.seconds / 60) % 60;

        const seconds = this.seconds % 60;

        if (this.seconds > 0) this.seconds--;
        else {
            this.clearTimerInterval();
        }

        return { hours, minutes, seconds };
    }

    setTimerInterval() {
        this.timerInterval = setInterval(() => {
            const { hours, minutes, seconds } = this.reduceTimer();
            this.displayTime({ hours, minutes, seconds });
        }, 1000);
    }

    clearTimerInterval() {
        console.log("ran");
        clearInterval(this.timerInterval);
        this.done();
    }

    done() {
        this.callback();
    }

    stop() {
        console.log("Timer stopped.");
        clearInterval(this.timerInterval);
    }
}
