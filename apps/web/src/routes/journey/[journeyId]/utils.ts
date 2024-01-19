export const dateFormatter = new Intl.DateTimeFormat("en-US", {
	weekday: "short",
	month: "short",
	day: "numeric",
});

export const timeFormatter = new Intl.DateTimeFormat("en-US", {
	hour: "numeric",
	minute: "numeric",
	hourCycle: "h24",
});
