const { execSync } = require('child_process');

exports.getHardDiskInfo =()=> {
  const output = execSync('df /').toString();
  const lines = output.split('\n');
  const dataLine = lines[1];
  const info = parseDfOutput(dataLine);
  if (info) {
    const totalGB = (info.totalBlocks * 1024) / (1024 * 1024 * 1024); // Convert KB to GB
    const usedGB = (info.usedBlocks * 1024) / (1024 * 1024 * 1024); // Convert KB to GB
    const availableGB = (info.availableBlocks * 1024) / (1024 * 1024 * 1024); // Convert KB to GB
    return {
      total: totalGB,
      used: usedGB,
      available: availableGB
    };
  }
  return null;
}