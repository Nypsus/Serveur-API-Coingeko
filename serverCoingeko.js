import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

// CORS pour ton frontend Netlify
const corsOptions = {
  origin: 'https://leverage1000indicator.netlify.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));

/** 🧠 Caching simple en mémoire **/
const cache = {};
const CACHE_DURATION = 30 * 1000; // 30 secondes

function isCacheValid(key) {
  return cache[key] && (Date.now() - cache[key].timestamp < CACHE_DURATION);
}

// Endpoint racine
app.get('/', (req, res) => {
  res.send('🚀 Serveur proxy CoinGecko en ligne !');
});

// ✅ Endpoint BNB (avec cache)
app.get('/price', async (req, res) => {
  const cacheKey = 'bnb';
  if (isCacheValid(cacheKey)) {
    console.log('✅ BNB - Servi depuis cache');
    return res.json(cache[cacheKey].data);
  }

  try {
    console.log('🌍 Requête à CoinGecko pour BNB');
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd'
    );
    cache[cacheKey] = { data: response.data, timestamp: Date.now() };
    res.json(response.data);
  } catch (error) {
    console.error('❌ Erreur CoinGecko (BNB):', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération du taux.' });
  }
});

// ✅ Endpoint dynamique : n'importe quelle crypto
app.get('/convert/:crypto', async (req, res) => {
  const crypto = req.params.crypto.toLowerCase();
  const cacheKey = `convert-${crypto}`;

  if (isCacheValid(cacheKey)) {
    console.log(`✅ ${crypto} - Servi depuis cache`);
    return res.json(cache[cacheKey].data);
  }

  try {
    console.log(`🌍 Requête à CoinGecko pour ${crypto}`);
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=usd`
    );
    cache[cacheKey] = { data: response.data, timestamp: Date.now() };
    res.json(response.data);
  } catch (error) {
    console.error(`❌ Erreur CoinGecko (${crypto}):`, error.message);
    res.status(500).json({ error: `Erreur lors de la récupération du taux pour ${crypto}.` });
  }
});

/** 🔒 Catch global pour éviter l'arrêt brutal du container **/
process.on('uncaughtException', (err) => {
  console.error('💥 Erreur non interceptée :', err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Promise rejetée non interceptée :', reason);
});

app.listen(PORT, () => {
  console.log(`✅ Serveur backend prêt sur le port ${PORT}`);
});
