import { ref, onMounted, onUnmounted } from 'vue'
import { fetchUpcomingEvents, fetchRecentNews, type DiveraEvent, type DiveraNews } from '../api/divera'

export function useInfoPanel(intervalSeconds = 300) {
  const events = ref<DiveraEvent[]>([])
  const news   = ref<DiveraNews[]>([])
  const error  = ref<string | null>(null)

  async function refresh() {
    try {
      const [e, n] = await Promise.all([fetchUpcomingEvents(), fetchRecentNews()])
      events.value = e
      news.value   = n
      error.value  = null
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Fehler'
    }
  }

  let timer: ReturnType<typeof setInterval>
  onMounted(() => { refresh(); timer = setInterval(refresh, intervalSeconds * 1000) })
  onUnmounted(() => clearInterval(timer))

  return { events, news, error, refresh }
}