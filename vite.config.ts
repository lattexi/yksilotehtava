import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
    base: '/~lauralek/dist/',
    plugins: [
        VitePWA({
            manifest: {
                name: 'Ravintolasovellus',
                short_name: 'Ravintolat',
                start_url: '/~lauralek/dist/',
                scope: '/~lauralek/dist/',
                display: 'standalone',
                background_color: '#ffffff',
                theme_color: '#007BFF',
                description: 'Näe ravintoloiden ruokalistat helposti.',
                icons: [
                    {
                        src: 'icons/icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'icons/icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true,
            },
        }),
    ],
});