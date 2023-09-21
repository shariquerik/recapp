# Copyright (c) 2021, Frappe Technologies Pvt. Ltd. and Contributors
# See license.txt

from __future__ import unicode_literals
import frappe


@frappe.whitelist()
def get_user_info(user=None):
	if frappe.session.user == "Guest":
		frappe.throw("Authentication failed", exc=frappe.AuthenticationError)

	filters = {'enabled': 1}
	if user:
		filters['name'] = user

	users = frappe.qb.get_query(
		"User",
		filters=filters,
		fields=["name", "email", "enabled", "user_image", "full_name", "user_type"],
		order_by="full_name asc",
		distinct=True,
	).run(as_dict=1)

	for user in users:
		if frappe.session.user == user.name:
			user.session_user = True

	return users
