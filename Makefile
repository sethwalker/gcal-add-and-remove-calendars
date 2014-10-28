gcal-add-and-remove-calendars.zip : *
	git ls-tree -r --name-only HEAD | grep -v Makefile | grep -v .gitignore | xargs zip gcal-add-and-remove-calendars.zip
