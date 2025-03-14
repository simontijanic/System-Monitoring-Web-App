const systemMetrics = require('../utils/metrics');

// leser fra proc/cpuinfo proc/meminfo proc/mounts og /etc/fstab

exports.getIndex = async (req, res) => {
    try {
        //const cpu = await systemMetrics.getCPUUsage();
        //const memory = await systemMetrics.getMemoryUsage();
        //const disk = await systemMetrics.getDiskUsage();
        //const systeminfo = await systemMetrics.getOperationSysteminfo();
        
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
}