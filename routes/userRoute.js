const router = require("express").Router();

const systemMetrics = require('../utils/metrics');

router.get("/", async (req, res) => {
    try {
        const [cpu, memory, disk, systeminfo] = await Promise.all([
            systemMetrics.getCPUUsage(),
            systemMetrics.getMemoryUsage(),
            systemMetrics.getDiskUsage(),
            systemMetrics.getOperationSysteminfo() 
        ]);

        res.render("index",{
            cpu,
            memory,
            disk,
            systeminfo
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch system metrics' });
    }
});

module.exports = router;
