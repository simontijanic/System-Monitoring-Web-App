const os = require('os');

exports.getMemoryInfo = () => {
  const total = Math.round(os.totalmem() / (1024 * 1024)); // Total memory in MB
  const free = Math.round(os.freemem() / (1024 * 1024)); // Free memory in MB
  const used = total - free; // Calculate used memory
  return { total, used, free };
}

exports.parseDfOutput = (output) => {
    const regex = /(\d+)\s+(\d+)\s+(\d+)\s+(\d+)%\s+\//;
    const match = output.match(regex);
    if (match) {
      return {
        totalBlocks: parseInt(match[1]),
        usedBlocks: parseInt(match[2]),
        availableBlocks: parseInt(match[3]),
        usePercent: parseInt(match[4])
      };
    }
    return null;
  }