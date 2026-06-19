Page first version

## Local development

Ruby is pinned to **3.3.4** (matching GitHub Pages) via [mise](https://mise.jdx.dev)
and `mise.toml` to avoid Ruby version conflict:

```
brew install mise   # one-time, if not already installed
make install        # install Ruby 3.3.4 + gems
make serve          # serve at http://localhost:4000
make build          # build into _site/
```

### favicon

Can try with the assets

```
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
<meta name="msapplication-TileColor" content="#ffc40d">
<meta name="theme-color" content="#ffffff">
```
