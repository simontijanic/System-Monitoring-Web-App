const systemMetrics = require('../utils/systemMetrics');
const logger = require('../utils/systemLogger');

exports.getIndex = async (req, res) => {
    try {
        const metricsPromises = [
            systemMetrics.getCPUUsage(),
            systemMetrics.getMemoryUsage(),
            systemMetrics.getDiskUsage(),
            systemMetrics.getOperationSysteminfo()
        ];

        const [cpu, memory, disk, systeminfo] = await Promise.allSettled(metricsPromises);

        const metrics = {
            cpu: cpu.status === 'fulfilled' ? cpu.value : null,
            memory: memory.status === 'fulfilled' ? memory.value : null,
            disk: disk.status === 'fulfilled' ? disk.value : null,
            systeminfo: systeminfo.status === 'fulfilled' ? systeminfo.value : null
        };

        await logger.checkMetrics(metrics);

        const filter = req.query.filter || 'all';
        const severity = req.query.severity || 'all';
        const logs = logger.getLogs(filter, severity);

        res.render("index", {
            ...metrics,
            logs,
            currentFilter: filter,
            currentSeverity: severity
        });
    } catch (error) {
        logger.addLog('system', error.message, 'error', {
            stack: error.stack,
            timestamp: new Date().toISOString()
        });
        res.status(500).render("error", { error: 'Failed to fetch system metrics' });
    }
};