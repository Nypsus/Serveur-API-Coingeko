import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

// Configuration CORS pour permettre l'accès depuis ton frontend
const corsOptions = {
  origin: 'https://leverage1000indicator.netlify.app', // Ton frontend Netlify
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

// Cache en mémoire pour stocker les résultats de l'API CoinGecko pendant 5 minutes
const cache = {};  

// Fonction pour vérifier le cache
const getFromCache = (key) => {
  if (cache[key] && (Date.now() - cache[key].timestamp) < 300000) { // Cache pendant 5 minutes
    return cache[key].data;
  }
  return null;
};

// Fonction pour mettre à jour le cache
const setCache = (key, data) => {
  cache[key] = {
    data,
    timestamp: Date.now()
  };
};

// Endpoint racine
app.get('/', (req, res) => {
  res.send('🚀 Serveur proxy CoinGecko en ligne !');
});

// Endpoint pour récupérer le taux de BNB
app.get('/price', async (req, res) => {
  const cacheKey = 'binancecoin-usd';

  // Vérifier si le taux est déjà dans le cache
  const cachedData = getFromCache(cacheKey);
  if (cachedData) {
    console.log('Renvoi du taux depuis le cache');
    return res.json(cachedData);
  }

  try {
    console.log("Requête reçue pour le taux de BNB");
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd'
    );
    console.log('Réponse reçue de CoinGecko:', response.data);

    // Mettre à jour le cache
    setCache(cacheKey, response.data);

    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error('Erreur CoinGecko (429): Trop de requêtes');
      res.status(429).json({ error: 'Trop de requêtes envoyées à CoinGecko. Veuillez réessayer plus tard.' });
    } else {
      console.error('Erreur CoinGecko (BNB):', error.message);
      res.status(500).json({ error: 'Erreur lors de la récupération du taux.' });
    }
  }
});

// 🆕 Endpoint pour récupérer le taux de n'importe quelle crypto
app.get('/convert/:crypto', async (req, res) => {
  const crypto = req.params.crypto.toLowerCase();
  console.log(`Requête reçue pour le taux de ${crypto}`);

  // Vérifier si le taux est déjà dans le cache
  const cacheKey = `${crypto}-usd`;
  const cachedData = getFromCache(cacheKey);
  if (cachedData) {
    console.log(`Renvoi du taux de ${crypto} depuis le cache`);
    return res.json(cachedData);
  }

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd`
    );
    console.log(`Réponse CoinGecko pour ${crypto}:`, response.data);

    // Mettre à jour le cache
    setCache(cacheKey, response.data);

    res.json(response.data);
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.error(`Erreur CoinGecko (${crypto}): Trop de requêtes`);
      res.status(429).json({ error: `Trop de requêtes envoyées à CoinGecko pour ${crypto}. Veuillez réessayer plus tard.` });
    } else {
      console.error(`Erreur CoinGecko (${crypto}):`, error.message);
      res.status(500).json({ error: `Erreur lors de la récupération du taux pour ${crypto}.` });
    }
  }
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur backend prêt sur le port ${PORT}`);
});
