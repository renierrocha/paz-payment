const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// Use o access_token do arquivo .env ou variável de ambiente
const ACCESS_TOKEN = process.env.ACCESS_TOKEN;

app.post('/criar-pix', async (req, res) => {
  const { nome, valor, inscricaoId } = req.body;

  try {
    const response = await axios.post(
      'https://api.mercadopago.com/v1/payments',
      {
        transaction_amount: Number(valor),
        description: `Inscrição evento: ${nome}`,
        payment_method_id: 'pix',
        payer: { email: `${inscricaoId}@exemplo.com` }
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // O QR code e o código "copia e cola" vêm na resposta
    res.json({
      qr_code_base64: response.data.point_of_interaction.transaction_data.qr_code_base64,
      qr_code: response.data.point_of_interaction.transaction_data.qr_code
    });
  } catch (e) {
    res.status(500).json({ error: e.toString() });
  }
});

app.listen(3000, () => console.log('Servidor rodando na porta 3000'));