/** @type {import('next').NextConfig} */
const nextConfig = {
  // Builds plain HTML/CSS/JS into the `out` folder, so it can be hosted for free
  // on GitHub Pages, Netlify or Vercel.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true }, // photos are pre-optimized by `npm run images`
};

export default nextConfig;
