import { build } from 'vite'
import { writeFileSync } from 'fs'
import react from '@vitejs/plugin-react'

const repoName = process.env.REPO_NAME
const deployId = process.env.DEPLOY_ID
const prototypePath = process.env.PROTOTYPE_PATH

if (!repoName || !deployId || !prototypePath) {
  console.error('Missing required env vars: REPO_NAME, DEPLOY_ID, PROTOTYPE_PATH')
  process.exit(1)
}

const base = `/${repoName}/static/${deployId}/`

console.log(`Building static export: ${base}`)

await build({
  plugins: [react()],
  base,
  build: { outDir: 'dist-static', emptyOutDir: true },
  define: {
    'import.meta.env.VITE_STATIC_PROTOTYPE_PATH': JSON.stringify(prototypePath),
  },
})

// Patch 404.html to redirect any unknown path back to the base
writeFileSync('dist-static/404.html', `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <script>window.location.replace('${base}');</script>
  </head>
</html>
`)

console.log(`Static export built successfully → dist-static/`)
