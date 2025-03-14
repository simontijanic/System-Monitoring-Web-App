module.exports = {
    app: {
        port: process.env.PORT || 3000
    },
    monitoring: {
        thresholds: {
            cpu: 80,    // 80% CPU usage
            memory: 60, // 90% Memory usage bruk 60 som test
            disk: 90,   // 90% Disk usage
            temp: 80    // 80°C temperature threshold
        },
        logging: {
            maxLogs: 1000,
            logsPerPage: 15
        }
    }
};