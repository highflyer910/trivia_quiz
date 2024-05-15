const express = require("express");
const socketIo = require("socket.io");
const http = require("http");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 5000;

app.get("/questions", async (req, res) => {
  const difficulty = req.query.difficulty;
  try {
    // Dynamic import for node-fetch
    const fetch = await import("node-fetch");
    const response = await fetch.default(
      `https://opentdb.com/api.php?amount=10&category=9&difficulty=${difficulty}&type=multiple`
    );
    const data = await response.json();
    res.json(data.results);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Errore durante il caricamento delle domande." });
  }
});

io.on("connection", (socket) => {
  console.log("Connessione stabilita: " + socket.id);

  socket.on("saveScore", (scoreData) => {
    console.log("Punteggio totale:", scoreData);
  });
});

server.listen(PORT, () => {
  console.log(`Server connesso sulla porta ${PORT}`);
});

app.use(express.static(__dirname));
