const os = require('os');

exports.getMemoryInfo = () => {
  const total = Math.round(os.totalmem() / (1024 * 1024)); // Total memory in MB
  const free = Math.round(os.freemem() / (1024 * 1024)); // Free memory in MB
  const used = total - free; // Calculate used memory
  return { total, used, free };
}
