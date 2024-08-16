/** @type {import('next').NextConfig} */
const nextConfig = {};

import withPWA from 'next-pwa';

const pwaConfig = withPWA({
    dest: "public",
    // disable: !isProduction,
    register: true,
});

export default pwaConfig(nextConfig);
