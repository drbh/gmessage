export const sinceTimestamp = (timestamp: any) => {
	return timeDiffToHuman(new Date().getTime(), new Date(timestamp).getTime());
};

export const timeDiffToHuman = (timestampA: any, timestampB: any) => {
	const currentTimestampUTC = timestampA;
	const sinceLastSeen = currentTimestampUTC - timestampB;
	const secondsSinceLastSeen = Math.floor(sinceLastSeen / 1000);
	const minutesSinceLastSeen = Math.floor(secondsSinceLastSeen / 60);
	const hoursSinceLastSeen = Math.floor(minutesSinceLastSeen / 60);
	const daysSinceLastSeen = Math.floor(hoursSinceLastSeen / 24);

	let lastSeen = '';
	if (daysSinceLastSeen > 0) {
		lastSeen = `${daysSinceLastSeen} days`;
	} else if (hoursSinceLastSeen > 0) {
		lastSeen = `${hoursSinceLastSeen} hours`;
	} else if (minutesSinceLastSeen > 0) {
		lastSeen = `${minutesSinceLastSeen} minutes`;
	} else {
		lastSeen = `${secondsSinceLastSeen} seconds`;
	}
	return lastSeen;
};
