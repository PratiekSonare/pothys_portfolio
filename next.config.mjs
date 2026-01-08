/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "export",
    env: {
        NEXT_PUBLIC_BACKEND_LINK: process.env.NEXT_PUBLIC_BACKEND_LINK,
    }
};

export default nextConfig;
