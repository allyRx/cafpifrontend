const { Router } = require('express');
const router = Router();

router.get('/test', (req, res) => {
  res.send('Test route');
});

module.exports = router;
