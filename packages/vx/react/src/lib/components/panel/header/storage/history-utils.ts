export const filterHistoryItems = <Item extends { title: string; url: string }>(
  items: Item[],
  search: string
) => {
  const query = search.toLowerCase()
  return items.filter(
    item =>
      item.title.toLowerCase().includes(query) ||
      item.url.toLowerCase().includes(query)
  )
}

export const groupHistoryItemsByDate = <Item>(
  items: Item[],
  getDate: (item: Item) => string
) =>
  items.reduce<Record<string, Item[]>>((groups, item) => {
    const date = getDate(item)
    ;(groups[date] ??= []).push(item)
    return groups
  }, {})

export const formatHistoryDate = (dateString: string) => {
  const date = new Date(dateString)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  if (dateString === today.toISOString().split('T')[0]) return 'Today'
  if (dateString === yesterday.toISOString().split('T')[0]) return 'Yesterday'
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}
