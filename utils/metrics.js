const si = require('systeminformation');

class SystemMetrics {
    async getCPUUsage() {
        const cpuData = await si.currentLoad();
        return {
            currentLoad: cpuData.currentLoad,
            cpuCount: cpuData.cpus.length
        };
    }

    async getMemoryUsage() {
        const memData = await si.mem();
        return {
            total: memData.total,
            used: memData.used,
            free: memData.free,
            usedPercentage: (memData.used / memData.total) * 100
        };
    }

    async getDiskUsage() {
        const diskData = await si.fsSize();
        return diskData.map(disk => ({
            filesystem: disk.fs,
            size: disk.size,
            used: disk.used,
            available: disk.available,
            usedPercentage: disk.use
        }));
    }
}

module.exports = new SystemMetrics();