clean: 
	@rm -rf dist

dist/:
	@mkdir -p $@

dist/manifest.json: packaging/manifest.json | dist/
	@cp $< $@

dist/main.js: src/main.js | dist/
	@cp $< $@

dist/git_issue_image_previewer.zip: dist/main.js dist/manifest.json
	@cd ${@D}; zip ${@F} ${^F}


