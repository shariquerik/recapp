# Copyright (c) 2023, Shariq Ansari and contributors
# For license information, please see license.txt

import frappe
from frappe.model.document import Document

class RecappNote(Document):

	def validate(self):
		if self.is_new():
			self.set_sequence_id()

	def set_sequence_id(self):
		sequence_id = frappe.get_all("Recapp Note",
			filters={ "date": self.date },
			order_by="sequence_id desc",
			pluck="sequence_id",
			limit=1
		) or [0]

		self.sequence_id = sequence_id[0] + 1
