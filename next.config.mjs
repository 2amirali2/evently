/** @type {import('next').NextConfig} */
const nextConfig = {
    typescript: {
        ignoreBuildErrors: true
    },
    images: {
        remotePatterns: [
            {
                hostname: 'files.edgestore.dev'
            }
        ]
    }
};

export default nextConfig;
