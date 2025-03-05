module.exports = {
  resolve: {
    fallback: {
      fs: false,
      path: false,
      os: false,
      crypto: false,
      stream: false,
      buffer: false,
      process: false,
    },
  },
}; 