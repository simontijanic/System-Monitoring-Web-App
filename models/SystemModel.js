const systemMetrics = require('../services/systemMetricsService');
const logger = require('../services/loggerService');

class SystemModel {
    async getSystemMetrics() {
        try {
            const [cpu, memory, disk, systeminfo] = await Promise.allSettled([
                systemMetrics.getCPUUsage(),
                systemMetrics.getMemoryUsage(),
                systemMetrics.getDiskUsage(),
                systemMetrics.getOperationSysteminfo()
            ]);

            const metrics = {
                cpu: cpu.status === 'fulfilled' ? cpu.value : null,
                memory: memory.status === 'fulfilled' ? memory.value : null,
                disk: disk.status === 'fulfilled' ? disk.value : null,
                systeminfo: systeminfo.status === 'fulfilled' ? systeminfo.value : null
            };

            await logger.checkMetrics(metrics);
            return metrics;
        } catch (error) {
            logger.addLog('system', error.message, 'error');
            throw error;
        }
    }

    getLogs(filter = 'all', severity = 'all', page = 1) {
        return logger.getLogs(filter, severity, page);
    }
}

module.exports = new SystemModel();