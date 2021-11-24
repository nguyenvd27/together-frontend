/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC__SERVER_URL: process.env.NODE_ENV !== "production" ? 'https://together-backend.herokuapp.com/api/v1' : 'http://localhost:8001/api/v1',
  },
}
