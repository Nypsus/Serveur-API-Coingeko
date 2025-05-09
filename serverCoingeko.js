import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: 'https://leverage1000indicator.netlify.app', // Ton frontend Netlify
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

// Endpoint racine
app.get('/', (req, res) => {
  res.send('🚀 Serveur proxy CoinGecko en ligne !');
});

// Endpoint pour récupérer le taux de BNB
app.get('/price', async (req, res) => {
  try {
    console.log("Requête reçue pour le taux de BNB");
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd'
    );
    console.log('Réponse reçue de CoinGecko:', response.data);
    res.json(response.data);
  } catch (error) {
    console.error('Erreur CoinGecko (BNB):', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération du taux.' });
  }
});

// 🆕 Endpoint pour récupérer le taux de n'importe quelle crypto
app.get('/convert/:crypto', async (req, res) => {
  const crypto = req.params.crypto.toLowerCase();
  console.log(`Requête reçue pour le taux de ${crypto}`);

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd`
    );
    console.log(`Réponse CoinGecko pour ${crypto}:`, response.data);
    res.json(response.data);
  } catch (error) {
    console.error(`Erreur CoinGecko (${crypto}):`, error.message);
    res.status(500).json({ error: `Erreur lors de la récupération du taux pour ${crypto}.` });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Serveur backend prêt sur le port ${PORT}`);
});
