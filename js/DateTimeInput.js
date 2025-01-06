class DateTimeInput {
    constructor(id = 0) {
        // Create container for the component
        this.id = id;
        this.isScheduleSet = false;
        this.container = document.createElement("div");

        // Create date input
        this.dateInput = document.createElement("input");
        this.dateInput.type = "date";

        // Create time input
        this.timeInput = document.createElement("input");
        this.timeInput.type = "time";

        // Append inputs to the container
        this.container.appendChild(this.dateInput);
        this.container.appendChild(this.timeInput);

        this.dateInput.addEventListener("input", () => this.setIsScheduleSet());
        this.timeInput.addEventListener("input", () => this.setIsScheduleSet());
    }

    getID() {
        return this.id;
    }

    getIsScheduleSet() {
        return this.isScheduleSet;
    }

    getIsScheduleNew() {
        return this.isScheduleNew;
    }

    render() {
        return this.container;
    }

    // Method to get the combined date and time as a JSON object
    getDateTime() {
        const dateValue = this.dateInput.value;
        const timeValue = this.timeInput.value;

        if (!dateValue || !timeValue) {
            return null
        }

        // Combine date and time in UTC
        const [year, month, day] = dateValue.split("-").map(Number);
        const [hours, minutes] = timeValue.split(":").map(Number);
        const utcDate = new Date(
            Date.UTC(year, month - 1, day, hours, minutes)
        );

        return utcDate.toISOString()
    }

    setIsScheduleNew(value){
        this.isScheduleNew = value;
    }

    // Method to set the date and time from an ISO 8601 string
    setDateTime(isoString) {
        const dateTime = new Date(isoString);
        if (isNaN(dateTime)) {
            throw new Error("Invalid ISO 8601 string.");
        }

        // Extract UTC date and time components
        const utcDate = dateTime.toISOString().split("T")[0];
        const utcTime = dateTime.toISOString().split("T")[1].slice(0, 5);

        // Set values to inputs
        this.dateInput.value = utcDate;
        this.timeInput.value = utcTime;

        this.setIsScheduleSet();
    }

    setIsScheduleSet() {
        this.isScheduleSet = !!this.dateInput.value && !!this.timeInput.value;
    }
}
