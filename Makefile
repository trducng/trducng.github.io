.PHONY: install serve build clean

# Ruby is pinned to 3.3.4 in mise.toml (matches GitHub Pages).
# mise is NOT auto-activated in the shell, so all Ruby commands go through `mise exec --`.

# Install the pinned Ruby and all gems
install:
	mise install
	mise exec -- bundle install

# Serve the site locally with live reload at http://localhost:4000
serve:
	mise exec -- bundle exec jekyll serve --livereload

# Build the static site into _site/
build:
	mise exec -- bundle exec jekyll build

# Remove the generated site and Jekyll cache
clean:
	mise exec -- bundle exec jekyll clean
