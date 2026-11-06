import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import util from 'util'

const execPromise = util.promisify(exec)

function gitSyncMiddleware(): Plugin {
  return {
    name: 'git-sync-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0] || ''
        if (!url.startsWith('/api/')) {
          return next()
        }

        res.setHeader('Content-Type', 'application/json')
        const dataDir = path.resolve(process.cwd(), 'data')
        if (!fs.existsSync(dataDir)) {
          fs.mkdirSync(dataDir, { recursive: true })
        }
        const invoicesFile = path.join(dataDir, 'invoices.json')
        const packagesFile = path.join(dataDir, 'packages.json')

        try {
          if (req.method === 'GET' && url === '/api/data') {
            const invoices = fs.existsSync(invoicesFile)
              ? JSON.parse(fs.readFileSync(invoicesFile, 'utf-8'))
              : []
            const packages = fs.existsSync(packagesFile)
              ? JSON.parse(fs.readFileSync(packagesFile, 'utf-8'))
              : []
            res.end(JSON.stringify({ success: true, invoices, packages }))
            return
          }

          if (req.method === 'POST') {
            const buffers = []
            for await (const chunk of req) {
              buffers.push(chunk)
            }
            const body = JSON.parse(Buffer.concat(buffers).toString('utf-8') || '{}')

            let commitMsg = ''

            if (url === '/api/save-invoice') {
              const invoices = fs.existsSync(invoicesFile)
                ? JSON.parse(fs.readFileSync(invoicesFile, 'utf-8'))
                : []
              const invoice = body.invoice
              if (invoice) {
                const existingIdx = invoices.findIndex(
                  (i: any) => i.id === invoice.id || i.invoiceNumber === invoice.invoiceNumber
                )
                if (existingIdx >= 0) {
                  invoices[existingIdx] = invoice
                } else {
                  invoices.unshift(invoice)
                }
                fs.writeFileSync(invoicesFile, JSON.stringify(invoices, null, 2), 'utf-8')
                commitMsg = `Auto-sync: update invoice ${invoice.invoiceNumber} (${invoice.client?.name || 'Client'}) [skip ci]`
              }
            } else if (url === '/api/save-package') {
              const packages = fs.existsSync(packagesFile)
                ? JSON.parse(fs.readFileSync(packagesFile, 'utf-8'))
                : []
              const pkg = body.package
              if (pkg) {
                const existingIdx = packages.findIndex((p: any) => p.id === pkg.id)
                if (existingIdx >= 0) {
                  packages[existingIdx] = pkg
                } else {
                  packages.unshift(pkg)
                }
                fs.writeFileSync(packagesFile, JSON.stringify(packages, null, 2), 'utf-8')
                commitMsg = `Auto-sync: update package "${pkg.title}" [skip ci]`
              }
            } else if (url === '/api/delete-package') {
              const packages = fs.existsSync(packagesFile)
                ? JSON.parse(fs.readFileSync(packagesFile, 'utf-8'))
                : []
              const filtered = packages.filter((p: any) => p.id !== body.id)
              fs.writeFileSync(packagesFile, JSON.stringify(filtered, null, 2), 'utf-8')
              commitMsg = `Auto-sync: delete package id ${body.id} [skip ci]`
            } else if (url === '/api/sync-all') {
              if (body.invoices) fs.writeFileSync(invoicesFile, JSON.stringify(body.invoices, null, 2), 'utf-8')
              if (body.packages) fs.writeFileSync(packagesFile, JSON.stringify(body.packages, null, 2), 'utf-8')
              commitMsg = 'Auto-sync: full sync of invoices & packages [skip ci]'
            }

            if (commitMsg) {
              execPromise(
                `git add data/ && git commit -m "${commitMsg.replace(/"/g, '\\"')}" && git push origin main`,
                { cwd: process.cwd() }
              )
                .then(() => {
                  console.log(`[Git Sync Success]: ${commitMsg}`)
                })
                .catch((err) => {
                  console.warn(`[Git Sync Notice]:`, err.message)
                })

              res.end(
                JSON.stringify({
                  success: true,
                  message: 'Saved and syncing to GitHub repository!',
                  commitMsg,
                })
              )
              return
            }
          }

          res.statusCode = 404
          res.end(JSON.stringify({ error: 'Endpoint not found' }))
        } catch (err: any) {
          console.error('[API Error]:', err)
          res.statusCode = 500
          res.end(JSON.stringify({ error: err.message }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    gitSyncMiddleware(),
  ],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
