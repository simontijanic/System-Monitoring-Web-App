exports.getProcessorInfo = () => {
    const output = execSync('lscpu').toString();
    const lines = output.split('\n');
    const info = {};
    
    for (const line of lines) {
      const [key, value] = line.split(':').map(part => part.trim());
      if (key) {
        info[key] = value;
      }
    }
    
    return {
      modelName: info['Model name'],
      numberOfCpus: parseInt(info['CPU(s)']),
      coresPerSocket: parseInt(info['Core(s) per socket']),
    };
  }