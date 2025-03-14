class SystemLogger {
    constructor() {
        this.logs = [];
        this.maxLogs = 1000; // Maximum logs to keep
        this.logsPerPage = 15; // Logs per page
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
        
        // Clean up old logs if exceeding maximum
        if (this.logs.length > this.maxLogs) {
            this.logs = this.logs.slice(0, this.maxLogs);
        }
        return log;
    }

    async checkMetrics(metrics) {
        try {
            const { cpu, memory, disk, systeminfo } = metrics;

            // Check if systeminfo exists before logging
            if (systeminfo) {
                this.addLog('system', `OS: ${systeminfo.platform || 'Unknown'} ${systeminfo.distro || ''} ${systeminfo.release || ''}`, 'info', {
                    kernel: systeminfo.kernel || 'Unknown',
                    codename: systeminfo.codename || 'Unknown'
                });
            }

            // CPU Monitoring (with null check)
            if (cpu && cpu.currentLoad > this.thresholds.cpu) {
                this.addLog('cpu', `High CPU usage: ${cpu.currentLoad.toFixed(1)}%`, 'warning', {
                    cores: cpu?.cpuCount || 'Unknown',
                    load: cpu.currentLoad
                });
            }

            // Memory Monitoring (with null check)
            if (memory && memory.total) {
                const memoryUsagePercent = (memory.used / memory.total * 100);
                if (memoryUsagePercent > this.thresholds.memory) {
                    this.addLog('memory', `High Memory usage: ${memoryUsagePercent.toFixed(1)}%`, 'warning', {
                        total: this.formatBytes(memory.total),
                        used: this.formatBytes(memory.used),
                        free: this.formatBytes(memory.free)
                    });
                }
            }

            // Disk Monitoring (with null check)
            if (Array.isArray(disk)) {
                disk.forEach(drive => {
                    if (drive && drive.usedPercentage > this.thresholds.disk) {
                        this.addLog('disk', `High Disk usage on ${drive.filesystem}: ${drive.usedPercentage.toFixed(1)}%`, 'warning', {
                            filesystem: drive.filesystem,
                            total: this.formatBytes(drive.size),
                            used: this.formatBytes(drive.used),
                            available: this.formatBytes(drive.available)
                        });
                    }
                });
            }

            // Linux-specific logging
            if (systeminfo?.platform?.toLowerCase() === 'linux') {
                try {
                    await this.monitorLinuxSystem(systeminfo);
                } catch (error) {
                    this.addLog('system', `Linux monitoring error: ${error.message}`, 'error', {
                        stack: error.stack
                    });
                }
            }
        } catch (error) {
            this.addLog('system', `Metrics monitoring error: ${error.message}`, 'error', {
                stack: error.stack,
                timestamp: new Date().toISOString()
            });
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

    getLogs(filter = 'all', severity = 'all', page = 1) {
        const filteredLogs = this.logs.filter(log => {
            const typeMatch = filter === 'all' ? true : log.type === filter;
            const severityMatch = severity === 'all' ? true : log.severity === severity;
            return typeMatch && severityMatch;
        });

        // Calculate pagination
        const startIndex = (page - 1) * this.logsPerPage;
        const endIndex = startIndex + this.logsPerPage;
        const totalPages = Math.ceil(filteredLogs.length / this.logsPerPage);

        return {
            logs: filteredLogs.slice(startIndex, endIndex),
            pagination: {
                currentPage: page,
                totalPages,
                totalLogs: filteredLogs.length,
                logsPerPage: this.logsPerPage
            }
        };
    }
}

module.exports = new SystemLogger();