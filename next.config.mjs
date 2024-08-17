/** @type {import('next').NextConfig} */
const nextConfig = {};

import withPWA from 'next-pwa';

const pwaConfig = withPWA({
    dest: "public",
    // disable: !isProduction,
    register: true,
    skipWaiting: true,
    scope: "/"
});

export default pwaConfig(nextConfig);
