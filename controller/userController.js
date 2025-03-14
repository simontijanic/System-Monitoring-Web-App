const systemMetrics = require('../utils/systemMetrics');
const logger = require('../utils/systemLogger');

exports.getIndex = async (req, res) => {
    try {
        const [cpu, memory, disk, systeminfo] = await Promise.all([
            systemMetrics.getCPUUsage(),
            systemMetrics.getMemoryUsage(),
            systemMetrics.getDiskUsage(),
            systemMetrics.getOperationSysteminfo() 
        ]);

        // Check metrics and generate logs if needed
        logger.checkMetrics({ cpu, memory, disk });

        // Get filtered logs
        const filter = req.query.filter || 'all';
        const severity = req.query.severity || 'all';
        const logs = logger.getLogs(filter, severity);

        res.render("index", {
            cpu,
            memory,
            disk,
            systeminfo,
            logs,
            currentFilter: filter,
            currentSeverity: severity
        });
    } catch (error) {
        logger.addLog('system', error.message, 'error');
        res.status(500).json({ error: 'Failed to fetch system metrics' });
    }
}