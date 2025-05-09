import express from 'express';
import cors from 'cors';
import axios from 'axios';

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: 'https://leverage1000indicator.netlify.app',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
};

// Appliquer CORS à toutes les routes
app.use(cors(corsOptions));

// Autoriser les requêtes préliminaires OPTIONS pour toutes les routes
app.options('*', cors(corsOptions));
