const PersonalRecord = require('../models/PersonalRecord');

function calculate1RM(weight, reps) {
  if (reps === 1) return weight;
  return Math.round(weight * (1 + reps / 30));
}

const getPRs = async (req, res) => {
  try {
    const prs = await PersonalRecord.find({ user: req.user._id }).sort({ bestWeight: -1 });
    res.json(prs);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getPR = async (req, res) => {
  try {
    const pr = await PersonalRecord.findOne({ user: req.user._id, exercise: req.params.exercise });
    if (!pr) return res.status(404).json({ message: 'No PR found' });
    res.json(pr);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updatePR = async (req, res) => {
  try {
    const { exercise, muscleGroup, weight, reps, sets } = req.body;
    const volume = (sets || 3) * (reps || 1) * (weight || 0);
    const estimated1RM = calculate1RM(weight || 0, reps || 1);

    let pr = await PersonalRecord.findOne({ user: req.user._id, exercise });

    if (!pr) {
      pr = await PersonalRecord.create({
        user: req.user._id,
        exercise,
        muscleGroup,
        bestWeight: weight || 0,
        bestVolume: volume,
        bestReps: reps || 0,
        estimated1RM,
        lastDate: new Date(),
        history: [{ weight, reps, sets, volume, date: new Date() }]
      });
      return res.json({ pr, isNew: true, isUpdated: true });
    }

    let isUpdated = false;
    if ((weight || 0) > pr.bestWeight) {
      pr.bestWeight = weight;
      isUpdated = true;
    }
    if (volume > pr.bestVolume) {
      pr.bestVolume = volume;
      isUpdated = true;
    }
    if ((reps || 0) > pr.bestReps) {
      pr.bestReps = reps;
      isUpdated = true;
    }
    if (estimated1RM > pr.estimated1RM) {
      pr.estimated1RM = estimated1RM;
      isUpdated = true;
    }

    pr.history.push({ weight, reps, sets, volume, date: new Date() });
    if (pr.history.length > 50) pr.history = pr.history.slice(-50);
    pr.lastDate = new Date();
    pr.muscleGroup = muscleGroup || pr.muscleGroup;

    await pr.save();
    res.json({ pr, isNew: false, isUpdated });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deletePR = async (req, res) => {
  try {
    await PersonalRecord.findOneAndDelete({ user: req.user._id, exercise: req.params.exercise });
    res.json({ message: 'PR deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getPRs, getPR, updatePR, deletePR };