const SystemModel = require('../models/SystemModel');
const logger = require('../services/loggerService');

class SystemController {
    async getDashboard(req, res) {
        try {
            const metrics = await SystemModel.getSystemMetrics();
            
            const filter = req.query.filter || 'all';
            const severity = req.query.severity || 'all';
            const page = parseInt(req.query.page) || 1;
            
            const { logs, pagination } = SystemModel.getLogs(filter, severity, page);

            // Add default values for undefined metrics
            const viewData = {
                cpu: metrics.cpu || { currentLoad: 0, cpuCount: 0 },
                memory: metrics.memory || { used: 0, total: 0, free: 0, usedPercentage: 0 },
                disk: metrics.disk || [],
                systeminfo: metrics.systeminfo || {},
                logs,
                pagination,
                currentFilter: filter,
                currentSeverity: severity
            };

            res.render("pages/dashboard", viewData);
        } catch (error) {
            logger.addLog('system', error.message, 'error');
            res.status(500).render("pages/error", { 
                error: 'Failed to fetch system metrics',
                systeminfo: {} // Add empty systeminfo for nav
            });
        }
    }
}

module.exports = new SystemController();