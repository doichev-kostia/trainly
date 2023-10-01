import { milliseconds } from "$lib/constants";

export const formatter = new Intl.DateTimeFormat("en-US", {
	hour: "2-digit",
	minute: "2-digit",
	hourCycle: "h24",
});

export function getTimeDifference(date1: Date, date2: Date) {
	const diff = date1.getTime() - date2.getTime();
	const days = Math.floor(diff / milliseconds.day);
	const hours = Math.floor(diff / milliseconds.hour) % 24;
	const minutes = Math.floor(diff / milliseconds.minute) % 60;
	const seconds = Math.floor(diff / milliseconds.second) % 60;
	return { days, hours, minutes, seconds };
}

export function getFormattedTimeDifference(date1: Date, date2: Date) {
	const { days, hours, minutes } = getTimeDifference(date1, date2);
	const parts = [];
	if (days) {
		parts.push(`${days}d`);
	}
	if (hours) {
		parts.push(`${hours}h`);
	}
	if (minutes) {
		parts.push(`${minutes}m`);
	}
	if (parts.length === 0) {
		return "0m";
	}
	return parts.join(" ");
}
