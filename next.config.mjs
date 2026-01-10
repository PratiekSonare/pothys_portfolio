/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    distDir: "build_out",
    env: {
        NEXT_PUBLIC_BACKEND_LINK: process.env.NEXT_PUBLIC_BACKEND_LINK,
    }
};

export default nextConfig;
