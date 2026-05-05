import { defineConfig } from 'vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
    server: {
        host: true,
        watch: {
            usePolling: true,
        }
    },
    plugins: [
        viteStaticCopy({
            targets: [{ src: 'assets', dest: '.' }]
        })
    ]
})
