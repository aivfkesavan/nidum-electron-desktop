import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime)

export function relativeDateFormat(date: string) {
  const now = dayjs()
  const chatDate = dayjs(date)
  const diffDays = now.diff(chatDate, 'day')
  const diffMonths = now.diff(chatDate, 'month')

  if (!now.isSame(chatDate, "year")) return chatDate.format('MMM YY')
  if (diffMonths > 0) return chatDate.format('MMM')

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  return `${diffDays} days ago`
}

