const express = require ('express');
const router = express.Router();
const Job = require('./Job');
const auth = require('./middleware');

// Get all jobs 
router.get('/jobs', auth, async (req, res)=> {
    try {
        const jobs = await Job.find();
        res.json(jobs);
    } catch (err) {
        res.status(500).json({message: err.message });
    }
});

// Add new job
router.post('/jobs', auth, async (req, res) => {
  try {
    const job = new Job(req.body);
    const savedJob = await job.save();
    res.json(savedJob);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update a Job
router.put('/jobs/:id', auth, async (req, res) => {
    try {
        const updated = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete a Job
router.delete('/jobs/:id', auth, async (req, res) => {
try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: 'Job deleted' });
} catch (err) {
    res.status(500).json({ message: err.message });
}
});

module.exports = router;
