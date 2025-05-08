import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS pour autoriser les deux frontends déployés
const corsOptions = {
  origin: ['https://leverage-indicator.netlify.app', 'https://leverage1000indicator.netlify.app'], // Liste des origines autorisées
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,  // Ajout de l'option credentials si tu utilises des cookies ou des sessions
};

// Applique la configuration CORS
app.use(cors(corsOptions));

// ✅ Route d'accueil
app.get('/', (req, res) => {
  res.send('🚀 Serveur proxy CoinGecko en ligne !');
});

// ✅ Route proxy vers CoinGecko
app.get('/price', async (req, res) => {
  try {
    console.log("🔄 Récupération des données de CoinGecko...");
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd'
    );
    console.log("✅ Réponse de CoinGecko reçue:", response.data);
    res.json(response.data);  // Envoie les données à la requête
  } catch (error) {
    console.error('Erreur lors de la récupération du taux:', error.message);
    res.status(500).json({ error: 'Erreur lors de la récupération du taux.' });
  }
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error('Erreur interne:', err.message);
  res.status(500).send('Internal Server Error');
});

// ✅ Lancement du serveur
app.listen(PORT, () => {
  console.log(`✅ Serveur backend prêt sur le port ${PORT}`);
});
