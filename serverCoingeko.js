import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Liste des origines autorisées
const allowedOrigins = [
  'https://leverage-indicator.netlify.app',
  'https://leverage1000indicator.netlify.app',
];

// ✅ Middleware CORS personnalisé
app.use((req, res, next) => {
  const origin = req.headers.origin;

  console.log('🔎 Requête reçue depuis :', origin); // Debug

  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);  // Autorise l'origine seulement si elle est dans la liste
  } else {
    res.setHeader('Access-Control-Allow-Origin', '*');  // Par défaut autorise tout (à ajuster en prod si nécessaire)
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Si c'est une requête preflight (OPTIONS), on répond directement
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // Réponse vide pour OPTIONS
  }

  next();
});

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
    console.error('❌ Erreur CoinGecko:', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération du taux.' });
  }
});

// ✅ Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur backend prêt sur le port ${PORT}`);
});
