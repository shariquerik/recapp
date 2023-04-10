import { createListResource, createResource } from 'frappe-ui'

export let notes = createListResource({
  type: 'list',
  doctype: 'Recapp Note',
  fields: ['name', 'title', 'date', 'description', 'link', 'sequence_id'],
  cache: 'Recapp Notes',
  orderBy: 'sequence_id asc',
  pageLength: 999,
  auto: true,
})

export function getNotes(date, duration) {
  if (duration === 'weekly') {
    let start_date = $dayjs(date).startOf('week').format('YYYY-MM-DD')
    let end_date = $dayjs(date).endOf('week').format('YYYY-MM-DD')

    let weekly_notes = notes.data?.filter(
      (note) => note.date >= start_date && note.date <= end_date
    ) || []

    // notes.data sort by date then sequence_id asc
    weekly_notes.sort((a, b) => {
      if (a.date === b.date) {
        return a.sequence_id - b.sequence_id
      }
      return a.date > b.date ? 1 : -1
    })

    return weekly_notes
  }
  return notes.data?.filter((note) => note.date === date) || []
}

export function update_note_sequence(notes) {
  let docs = notes.map((note, index) => ({
    doctype: 'Recapp Note',
    docname: note.name,
    sequence_id: index + 1,
    old_sequence_id: note.sequence_id,
  }))

  docs = docs.filter((doc) => doc.sequence_id !== doc.old_sequence_id)
  docs.forEach((doc) => delete doc.old_sequence_id)

  createResource({ url: 'frappe.client.bulk_update' }).submit({
    docs: JSON.stringify(docs),
  })
}
