import express from 'express';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Liste des origines autorisées
const allowedOrigins = [
  'https://leverage-indicator.netlify.app',
  'https://leverage1000indicator.netlify.app',
];

// ✅ Middleware CORS personnalisé pour appliquer les entêtes à toutes les requêtes
app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log('🔎 Requête reçue depuis :', origin); // Log l'origine pour débogage

  // Vérification de l'origine dans la liste
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);  // Autoriser uniquement les origines valides
  } else {
    // Pour les tests, autoriser toutes les origines (pas recommandé en production)
    res.setHeader('Access-Control-Allow-Origin', '*');  
  }

  // Ajouter les autres entêtes CORS nécessaires
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');  // Autorise le header Authorization si nécessaire

  // Pour répondre aux requêtes OPTIONS (CORS prévolées)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);  // Réponse vide pour les requêtes prévolées
  }

  next();  // Passer à la requête suivante
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
