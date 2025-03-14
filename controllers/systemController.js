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

            res.render("dashboard", {
                ...metrics,
                logs,
                pagination,
                currentFilter: filter,
                currentSeverity: severity
            });
        } catch (error) {
            logger.addLog('system', error.message, 'error');
            res.status(500).render("error", { error: 'Failed to fetch system metrics' });
        }
    }
}

module.exports = new SystemController();