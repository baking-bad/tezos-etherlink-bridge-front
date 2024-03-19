import { DateTime } from "luxon"

export const parseTime = (time) => {
	if (!DateTime.fromISO(time).invalid) return DateTime.fromISO(time)

	if (!DateTime.fromMillis(+time).invalid) return DateTime.fromMillis(+time)

	return ''
}
