import { format, parseISO, formatDistanceToNow } from 'date-fns'
import { ja } from 'date-fns/locale'

export function formatDate(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return format(date, 'yyyy年MM月dd日', { locale: ja })
  } catch (error) {
    console.error('Date formatting error:', error)
    return dateString
  }
}

export function formatTime(timeString: string): string {
  try {
    // 時間形式（HH:mm:ss）または日時形式（ISO 8601）の両方に対応
    const dateTime = timeString.includes('T')
      ? parseISO(timeString)
      : parseISO(`2000-01-01T${timeString}`)
    
    return format(dateTime, 'HH:mm', { locale: ja })
  } catch (error) {
    console.error('Time formatting error:', error)
    return timeString
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return format(date, 'yyyy年MM月dd日 HH:mm', { locale: ja })
  } catch (error) {
    console.error('DateTime formatting error:', error)
    return dateString
  }
}

export function formatRelativeTime(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return formatDistanceToNow(date, { addSuffix: true, locale: ja })
  } catch (error) {
    console.error('Relative time formatting error:', error)
    return dateString
  }
}

export function formatDateForInput(dateString: string): string {
  try {
    const date = parseISO(dateString)
    return format(date, 'yyyy-MM-dd')
  } catch (error) {
    console.error('Date formatting error:', error)
    return ''
  }
}

export function formatTimeForInput(timeString: string): string {
  try {
    const dateTime = timeString.includes('T')
      ? parseISO(timeString)
      : parseISO(`2000-01-01T${timeString}`)
    
    return format(dateTime, 'HH:mm')
  } catch (error) {
    console.error('Time formatting error:', error)
    return ''
  }
}