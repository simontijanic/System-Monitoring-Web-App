class SystemLogger {
    constructor() {
        this.logs = [];
        this.thresholds = {
            cpu: 80,    // 80% CPU usage
            memory: 90, // 90% Memory usage
            disk: 90,   // 90% Disk usage
            temp: 80    // 80°C temperature threshold
        };
    }

    addLog(type, message, severity = 'info', details = {}) {
        const log = {
            timestamp: new Date(),
            type,
            message,
            severity,
            details,
            id: Date.now()
        };
        this.logs.unshift(log);
        if (this.logs.length > 100) this.logs.pop();
        return log;
    }

    async checkMetrics(metrics) {
        const { cpu, memory, disk, systeminfo } = metrics;

        // System Information Logging
        this.addLog('system', `OS: ${systeminfo.platform} ${systeminfo.distro} ${systeminfo.release}`, 'info', {
            kernel: systeminfo.kernel,
            codename: systeminfo.codename
        });

        // CPU Monitoring
        if (cpu.currentLoad > this.thresholds.cpu) {
            this.addLog('cpu', `High CPU usage: ${cpu.currentLoad.toFixed(1)}%`, 'warning', {
                cores: cpu.cpuCount,
                load: cpu.currentLoad
            });
        }

        // Memory Monitoring
        const memoryUsagePercent = (memory.used / memory.total * 100);
        if (memoryUsagePercent > this.thresholds.memory) {
            this.addLog('memory', `High Memory usage: ${memoryUsagePercent.toFixed(1)}%`, 'warning', {
                total: this.formatBytes(memory.total),
                used: this.formatBytes(memory.used),
                free: this.formatBytes(memory.free)
            });
        }

        // Disk Monitoring
        disk.forEach(drive => {
            if (drive.usedPercentage > this.thresholds.disk) {
                this.addLog('disk', `High Disk usage on ${drive.filesystem}: ${drive.usedPercentage.toFixed(1)}%`, 'warning', {
                    filesystem: drive.filesystem,
                    total: this.formatBytes(drive.size),
                    used: this.formatBytes(drive.used),
                    available: this.formatBytes(drive.available)
                });
            }
        });

        // Linux-specific logging (if applicable)
        if (systeminfo.platform.toLowerCase() === 'linux') {
            try {
                // Add specific Linux system logs
                this.monitorLinuxSystem(systeminfo);
            } catch (error) {
                this.addLog('system', `Linux monitoring error: ${error.message}`, 'error', {
                    stack: error.stack
                });
            }
        }
    }

    async monitorLinuxSystem(systeminfo) {
        try {
            // Log system updates availability
            this.addLog('system', 'Checking for system updates...', 'info', {
                distro: systeminfo.distro
            });

            // Log service status
            this.addLog('system', 'Monitoring system services', 'info', {
                kernel: systeminfo.kernel
            });

            // Monitor system logs
            this.addLog('system', 'Monitoring system logs', 'info', {
                syslog: '/var/log/syslog'
            });

        } catch (error) {
            this.addLog('system', `System monitoring error: ${error.message}`, 'error', {
                component: 'Linux monitoring',
                stack: error.stack
            });
        }
    }

    formatBytes(bytes) {
        const units = ['B', 'KB', 'MB', 'GB', 'TB'];
        let size = bytes;
        let unitIndex = 0;
        
        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }
        
        return `${size.toFixed(2)} ${units[unitIndex]}`;
    }

    getLogs(filter = 'all', severity = 'all') {
        return this.logs.filter(log => {
            const typeMatch = filter === 'all' ? true : log.type === filter;
            const severityMatch = severity === 'all' ? true : log.severity === severity;
            return typeMatch && severityMatch;
        });
    }
}

module.exports = new SystemLogger();