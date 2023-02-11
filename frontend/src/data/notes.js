import { createListResource, createResource } from 'frappe-ui'

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
