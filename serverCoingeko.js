import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS pour autoriser ton frontend déployé
const corsOptions = {
  origin: 'https://leverage-indicator.netlify.app',  // Remplace par l'URL de ton frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

app.use(cors(corsOptions));  // Applique la configuration CORS

// ✅ Route d'accueil
app.get('/', (req, res) => {
  res.send('🚀 Serveur proxy CoinGecko en ligne !');
});

// ✅ Route proxy vers CoinGecko
app.get('/price', async (req, res) => {
  try {
    console.log("Requête reçue pour le taux de BNB");  // Ajoute des logs pour suivre
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd'
    );
    console.log('Réponse reçue de CoinGecko:', response.data);  // Affiche la réponse pour voir si ça fonctionne
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
