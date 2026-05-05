import { build } from 'vite'
import { readFileSync, writeFileSync } from 'fs'
import react from '@vitejs/plugin-react'

const repoName = process.env.REPO_NAME
const deployId = process.env.DEPLOY_ID
const prototypePath = process.env.PROTOTYPE_PATH

if (!repoName || !deployId || !prototypePath) {
  console.error('Missing required env vars: REPO_NAME, DEPLOY_ID, PROTOTYPE_PATH')
  process.exit(1)
}

const base = `/${repoName}/static/${deployId}/`
const baseDepth = base.split('/').filter(Boolean).length // = 3

console.log(`Building static export: ${base}`)

await build({
  plugins: [react()],
  base,
  build: { outDir: 'dist-static', emptyOutDir: true },
})

// Patch 404.html with depth-correct SPA redirect for nested base path
writeFileSync('dist-static/404.html', `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <script>
      var l = window.location;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        l.pathname.split('/').slice(0, ${baseDepth + 1}).join('/') +
        '/?p=' + encodeURIComponent(l.pathname.split('/').slice(${baseDepth + 1}).join('/')) +
        (l.search ? '&q=' + encodeURIComponent(l.search.slice(1)) : '') +
        l.hash
      );
    </script>
  </head>
</html>
`)

// Patch index.html to auto-navigate to the prototype on first load
const indexPath = 'dist-static/index.html'
let html = readFileSync(indexPath, 'utf8')
const autoNav = `  <script>
    (function () {
      var p = window.location.pathname.replace(/\\/$/, '');
      var b = '${base.replace(/\/$/, '')}';
      if (p === b || p === '') {
        window.history.replaceState(null, null, b + '${prototypePath}');
      }
    })();
  </script>`
html = html.replace('</head>', autoNav + '\n  </head>')
writeFileSync(indexPath, html)

console.log(`Static export built successfully → dist-static/`)
