import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Liste des frontends autorisés
const allowedOrigins = [
  'https://leverage-indicator.netlify.app',
  'https://leverage1000indicator.netlify.app'
];

// ✅ Configuration CORS avec fonction pour gérer plusieurs origines
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // Autorisé
    } else {
      callback(new Error('Not allowed by CORS')); // Rejeté
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

// ✅ Application de CORS
app.use(cors(corsOptions));

// ✅ Route d'accueil
app.get('/', (req, res) => {
  res.send('🚀 Serveur proxy CoinGecko en ligne !');
});

// ✅ Route proxy vers CoinGecko
app.get('/price', async (req, res) => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd'
    );
    res.json(response.data);
  } catch (error) {
    console.error('Erreur CoinGecko:', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération du taux.' });
  }
});

// ✅ Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur backend prêt sur le port ${PORT}`);
});
