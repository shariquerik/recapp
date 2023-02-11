import { createListResource } from 'frappe-ui'

export let notes = createListResource({
  type: 'list',
  doctype: 'Recapp Note',
  fields: ['name', 'title', 'date', 'description', 'link', 'sequence_id'],
  cache: 'Recapp Notes',
  orderBy: 'sequence_id asc',
  auto: true,
})

export function getNotes(date) {
  return notes.data?.filter((note) => note.date === date) || []
}
