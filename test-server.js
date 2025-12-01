const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  res.json({ ok: true });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server on ${PORT}`);
});
