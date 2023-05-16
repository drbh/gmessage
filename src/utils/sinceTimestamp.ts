export const sinceTimestamp = (timestamp: any) => {
	// get time since 2023-05-15 05:02:04
	const currentTimestampUTC = new Date().getTime() // + new Date().getTimezoneOffset() * 60000;
	const sinceLastSeen = currentTimestampUTC - new Date(timestamp + 'Z').getTime();
	const secondsSinceLastSeen = Math.floor(sinceLastSeen / 1000);
	const minutesSinceLastSeen = Math.floor(secondsSinceLastSeen / 60);
	const hoursSinceLastSeen = Math.floor(minutesSinceLastSeen / 60);
	const daysSinceLastSeen = Math.floor(hoursSinceLastSeen / 24);

	let lastSeen = '';
	if (daysSinceLastSeen > 0) {
		lastSeen = `${daysSinceLastSeen} days ago`;
	} else if (hoursSinceLastSeen > 0) {
		lastSeen = `${hoursSinceLastSeen} hours ago`;
	} else if (minutesSinceLastSeen > 0) {
		lastSeen = `${minutesSinceLastSeen} minutes ago`;
	} else {
		lastSeen = `${secondsSinceLastSeen} seconds ago`;
	}
	return lastSeen;
};
