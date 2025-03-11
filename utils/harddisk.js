const { execSync } = require('child_process');

function parseDfOutput(output){
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