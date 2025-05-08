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
  console.log('🔎 Requête reçue depuis :', origin); // Log l'origine pour débogage

  // Vérifier l'origine et ajouter les headers CORS
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // Pour les tests, autoriser toutes les origines (pas recommandé en production)
    res.setHeader('Access-Control-Allow-Origin', '*');  
  }

  // Entêtes supplémentaires pour CORS
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Réponse aux requêtes OPTIONS (CORS prévolées)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // Réponse vide pour les prévolées
  }

  next(); // Passer à la suite
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
