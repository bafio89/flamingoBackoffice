import { NextApiRequest, NextApiResponse } from 'next';
import { google } from 'googleapis';

interface VerificationResponse {
  success: boolean;
  message: string;
  isMember: boolean;
  entriesCount?: number; // Aggiungo il contatore degli ingressi
  tesseraType?: string; // Aggiungo il tipo di tessera
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VerificationResponse>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
      isMember: false
    });
  }

  const { ID } = req.query;

  if (!ID || typeof ID !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'ID parameter is required',
      isMember: false
    });
  }

  try {
    // Configura l'autenticazione con Service Account (ora con permessi di scrittura)
    const auth = new google.auth.GoogleAuth({
      credentials: {
        type: "service_account",
        project_id: process.env.GOOGLE_PROJECT_ID,
        private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        client_id: process.env.GOOGLE_CLIENT_ID
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'], // Cambiato da readonly a read/write
    });

    const sheets = google.sheets({ version: 'v4', auth });

    const spreadsheetId = '1vJPuwdbZ-hjuPmcNdymrdg401CQUsDKjTlKOep_afus';

    // Prima leggi l'header per trovare le colonne dinamicamente
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: 'Check Ingressi!1:1', // Leggi solo la prima riga (header)
    });

    const headerValues = headerResponse.data.values;
    if (!headerValues || headerValues.length === 0 || !headerValues[0]) {
      return res.status(500).json({
        success: false,
        message: '🌊 Errore durante la lettura dell\'header. Riprova più tardi! 🌊',
        isMember: false
      });
    }

    // Trova gli indici delle colonne UUID, Ingressi e Tessera
    const headers = headerValues[0];
    const uuidColumnIndex = headers.findIndex((header: string) =>
      header && header.toString().toLowerCase().includes('uuid')
    );
    const ingressiColumnIndex = headers.findIndex((header: string) =>
      header && header.toString().toLowerCase().includes('ingressi')
    );
    const tesseraColumnIndex = headers.findIndex((header: string) =>
      header && header.toString().toLowerCase().includes('tipo tes')
    );

    if (uuidColumnIndex === -1) {
      return res.status(500).json({
        success: false,
        message: '🌊 Colonna UUID non trovata nel foglio. Contatta l\'amministratore! 🌊',
        isMember: false
      });
    }

    if (ingressiColumnIndex === -1) {
      return res.status(500).json({
        success: false,
        message: '🌊 Colonna Ingressi non trovata nel foglio. Contatta l\'amministratore! 🌊',
        isMember: false
      });
    }

    if (tesseraColumnIndex === -1) {
      return res.status(500).json({
        success: false,
        message: '🌊 Colonna "Tipo Tes" non trovata nel foglio. Contatta l\'amministratore! 🌊',
        isMember: false
      });
    }

    // Converti gli indici in lettere di colonna (A=0, B=1, C=2, ...)
    const getColumnLetter = (index: number): string => {
      let result = '';
      while (index >= 0) {
        result = String.fromCharCode(65 + (index % 26)) + result;
        index = Math.floor(index / 26) - 1;
      }
      return result;
    };

    const uuidColumn = getColumnLetter(uuidColumnIndex);
    const ingressiColumn = getColumnLetter(ingressiColumnIndex);

    // Trova l'indice minimo e massimo per leggere tutte le colonne necessarie
    const minColumnIndex = Math.min(uuidColumnIndex, ingressiColumnIndex, tesseraColumnIndex);
    const maxColumnIndex = Math.max(uuidColumnIndex, ingressiColumnIndex, tesseraColumnIndex);
    const minColumn = getColumnLetter(minColumnIndex);
    const maxColumn = getColumnLetter(maxColumnIndex);

    // Ora leggi tutte le colonne necessarie
    const range = `Check Ingressi!${minColumn}:${maxColumn}`;

    // Leggi i dati dal foglio
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });

    const values = response.data.values;

    if (!values || values.length === 0) {
      return res.status(500).json({
        success: false,
        message: '🌊 Errore durante la lettura dei dati. Riprova più tardi! 🌊',
        isMember: false
      });
    }

    // Cerca l'ID nelle celle della colonna UUID (saltando l'header)
    let foundRowIndex = -1;
    let currentEntries = 0;
    let tesseraType = '';

    for (let i = 1; i < values.length; i++) {
      // Calcola l'indice della colonna UUID relativamente alla colonna minima
      const uuidRelativeIndex = uuidColumnIndex - minColumnIndex;

      if (values[i][uuidRelativeIndex] && values[i][uuidRelativeIndex].toString().trim() === ID.trim()) {
        foundRowIndex = i;

        // Calcola gli indici delle altre colonne relativamente alla colonna minima
        const ingressiRelativeIndex = ingressiColumnIndex - minColumnIndex;
        const tesseraRelativeIndex = tesseraColumnIndex - minColumnIndex;

        // Leggi il valore attuale degli ingressi
        const entriesValue = values[i][ingressiRelativeIndex];
        currentEntries = entriesValue && !isNaN(Number(entriesValue)) ? Number(entriesValue) : 0;

        // Leggi il tipo di tessera
        tesseraType = values[i][tesseraRelativeIndex] ? values[i][tesseraRelativeIndex].toString().trim() : 'Non specificato';

        break;
      }
    }

    if (foundRowIndex === -1) {
      return res.status(404).json({
        success: false,
        message: '🦩 Ops! Non riusciamo a trovare il tuo ID nel nostro database. Controlla di aver inserito l\'ID corretto! 🦩',
        isMember: false
      });
    }

    // Incrementa il contatore degli ingressi
    const newEntriesCount = currentEntries + 1;

    // Aggiorna il valore nel foglio (riga foundRowIndex + 1 perché le righe in Google Sheets iniziano da 1, non da 0)
    const updateRange = `Check Ingressi!${ingressiColumn}${foundRowIndex + 1}`;

    console.log('Debug info:', {
      foundRowIndex,
      currentEntries,
      newEntriesCount,
      updateRange,
      uuidColumn,
      ingressiColumn,
      uuidColumnIndex,
      ingressiColumnIndex
    });

    try {
      const updateResult = await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: updateRange,
        valueInputOption: 'RAW',
        requestBody: {
          values: [[newEntriesCount]]
        }
      });

      console.log('Update result:', updateResult.data);
    } catch (updateError) {
      console.error('Update error:', updateError);
      // Continua comunque con la risposta di successo, ma segnala il problema
      return res.status(200).json({
        success: true,
        message: `🌺 ID verificato! Sei un socio attivo del nostro surf club! 🏄‍♀️ (Errore aggiornamento contatore)`,
        isMember: true,
        entriesCount: newEntriesCount
      });
    }

    return res.status(200).json({
      success: true,
      message: `🌺 Ottimo! Sei un socio attivo del nostro surf club! 🏄‍♀️ **Questo è il tuo ingresso #${newEntriesCount}!**${newEntriesCount > 1 ? ' ⚠️' : ''}`,
      isMember: true,
      entriesCount: newEntriesCount,
      tesseraType: tesseraType
    });

  } catch (error) {
    console.error('Error verifying subscription:', error);
    return res.status(500).json({
      success: false,
      message: '🌊 Errore durante la verifica. Riprova più tardi! 🌊',
      isMember: false
    });
  }
}
