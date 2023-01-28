from setuptools import setup, find_packages

with open("requirements.txt") as f:
	install_requires = f.read().strip().split("\n")

# get version from __version__ variable in recapp/__init__.py
from recapp import __version__ as version

setup(
	name="recapp",
	version=version,
	description="Keep track of daily work/task",
	author="Shariq Ansari",
	author_email="shariq@frappe.io",
	packages=find_packages(),
	zip_safe=False,
	include_package_data=True,
	install_requires=install_requires
)
