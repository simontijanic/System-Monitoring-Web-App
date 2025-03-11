const router = require("express").Router();

const memory = require("../utils/memory");
const harddisk = require("../utils/harddisk");
const processor = require("../utils/processor");

router.get("/", (req, res) => {
  const memoryInfo = memory.getMemoryInfo();
  const hardDiskInfo = harddisk.getHardDiskInfo();
  const processorInfo = processor.getProcessorInfo();

  res.render("index", {memoryInfo, hardDiskInfo, processorInfo});
});

module.exports = router;
