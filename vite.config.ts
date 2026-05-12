import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { execSync } from 'node:child_process'

function safeExec(cmd: string): string {
  try {
    return execSync(cmd, { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()
  } catch {
    return ''
  }
}

const sandboxSha = safeExec('git rev-parse HEAD')
const sandboxRemoteUrl = safeExec('git remote get-url origin')
const sandboxRepo = sandboxRemoteUrl.match(/github\.com[:/](.+?)(?:\.git)?$/)?.[1] ?? ''
const sandboxDirty = safeExec('git status --porcelain').length > 0

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react()],
    base: env.BASE_URL || process.env.BASE_URL || '/instui-sandbox-mtrame/',
    define: {
      __SANDBOX_SHA__: JSON.stringify(sandboxSha),
      __SANDBOX_REPO__: JSON.stringify(sandboxRepo),
      __SANDBOX_DIRTY__: JSON.stringify(sandboxDirty),
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
          embed: resolve(__dirname, 'embed.html'),
        },
      },
    },
  }
})
