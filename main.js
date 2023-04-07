const { completeScrapperParser } = require('./index.js');

module.exports = async (req, res) => {
  try {
    const horario = await completeScrapperParser();
    res.status(200).json(horario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};