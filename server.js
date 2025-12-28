import express from "express";

const app = express();

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("¡Servidor funcionando en Railway!");
});

// Puerto dinámico de Railway
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});