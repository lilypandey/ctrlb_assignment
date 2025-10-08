export const SAMPLE_DATA = Array.from({ length: 50 }, (_, i) => ({
  name: `${i + 1}`,
  uv: Math.floor(Math.random() * 5000) + 1000,
  pv: Math.floor(Math.random() * 10000) + 500,
}));