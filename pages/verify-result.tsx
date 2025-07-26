import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface VerificationResult {
  success: boolean;
  message: string;
  isMember: boolean;
  entriesCount?: number; // Aggiungo il contatore degli ingressi
  tesseraType?: string; // Aggiungo il tipo di tessera
}

export default function VerifyResult() {
  const router = useRouter();
  const { id } = router.query;
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Aspetta che il router sia pronto prima di fare qualsiasi controllo
    if (!router.isReady) return;

    if (!id || typeof id !== 'string') {
      router.push('/');
      return;
    }

    const verifyId = async () => {
      try {
        const response = await fetch(`/api/verify-subscription?ID=${encodeURIComponent(id)}`);
        const data = await response.json();
        setResult(data);
      } catch (error) {
        setResult({
          success: false,
          message: '🌊 Errore di connessione. Riprova più tardi! 🌊',
          isMember: false
        });
      } finally {
        setLoading(false);
      }
    };

    verifyId();
  }, [id, router]);

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <div className="loading">
            <div className="spinner"></div>
            <p>🌊 Verificando il tuo ID...</p>
          </div>
        </div>
        <LoadingStyles />
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <>
      <Head>
        <title>Risultato Verifica - Flamingo Surf Club</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦩</text></svg>" />
      </Head>

      <div className="container">
        <div className="card">
          {/* Header con logo/titolo */}
          <div className="header">
            <div className="logo">🦩</div>
            <h1>Flamingo Surf Club</h1>
            <p>Risultato Verifica Iscrizione</p>
          </div>

          {/* ID verificato */}
          <div className="id-section">
            <div className="id-label">ID Verificato:</div>
            <div className="id-value">{id}</div>
          </div>

          {/* Risultato principale */}
          <div className={`result-section ${result.isMember ? 'success' : 'error'}`}>
            <div className="status-icon">
              {result.isMember ? '✅' : '❌'}
            </div>
            <div className="status-title">
              {result.isMember ? 'Socio Verificato!' : 'Socio Non Trovato'}
            </div>
            <div className="status-message">
              {result.message}
            </div>
            {/* Tipo tessera per soci verificati */}
            {result.isMember && result.tesseraType && (
              <div className="tessera-section">
                <div className="tessera-label">Tipo tessera:</div>
                <div className="tessera-value">{result.tesseraType}</div>
              </div>
            )}
            {/* Avvertimento per ingressi multipli */}
            {result.isMember && result.entriesCount && result.entriesCount > 1 && (
              <div className="warning-section">
                <div className="warning-icon">⚠️</div>
                <div className="warning-text">
                  <strong>Attenzione:</strong> Questo utente ha già effettuato <strong>{result.entriesCount - 1}</strong> ingressi precedenti.
                </div>
              </div>
            )}
          </div>

          {/* Informazioni aggiuntive */}
          {result.isMember ? (
            <div className="info-section success-info">
              <h3>🌺 Benvenuto nel club! 🌺</h3>
              <ul>
                <li>✨ Accesso a tutte le attività del club</li>
                <li>🏄‍♀️ Lezioni di surf incluse</li>
                <li>🦩 Sconti su attrezzature</li>
                <li>🌊 Eventi esclusivi per soci</li>
              </ul>
            </div>
          ) : (
            <div className="info-section error-info">
              <h3>🦩 Come diventare socio 🦩</h3>
              <ul>
                <li>📞 Contatta la segreteria</li>
                <li>📧 Invia una email per info</li>
                <li>🌊 Vieni a trovarci in spiaggia</li>
                <li>📱 Seguici sui social media</li>
              </ul>
            </div>
          )}

          {/* Footer con azioni */}
          <div className="footer">
            <Link href="/" className="btn secondary">
              🔍 Verifica un altro ID
            </Link>
            {result.isMember && (
              <a href="#" className="btn primary">
                🏄‍♀️ Area Soci
              </a>
            )}
          </div>
        </div>

        <style jsx>{`
          .container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
            background: linear-gradient(135deg, #ff6b9d 0%, #4ecdc4 50%, #45b7d1 100%);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }

          .card {
            background: white;
            border-radius: 20px;
            padding: 0;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 450px;
            overflow: hidden;
          }

          .header {
            background: linear-gradient(135deg, #ff6b9d, #4ecdc4);
            color: white;
            text-align: center;
            padding: 30px 20px;
          }

          .logo {
            font-size: 48px;
            margin-bottom: 10px;
          }

          .header h1 {
            margin: 0 0 5px 0;
            font-size: 24px;
            font-weight: 700;
          }

          .header p {
            margin: 0;
            font-size: 16px;
            opacity: 0.9;
          }

          .id-section {
            padding: 20px;
            background: #f8f9fa;
            border-bottom: 1px solid #e9ecef;
            text-align: center;
          }

          .id-label {
            font-size: 14px;
            color: #6c757d;
            margin-bottom: 5px;
            font-weight: 500;
          }

          .id-value {
            font-size: 20px;
            font-weight: bold;
            color: #2c3e50;
            font-family: 'Courier New', monospace;
            background: white;
            padding: 8px 16px;
            border-radius: 8px;
            display: inline-block;
            border: 2px solid #e9ecef;
          }

          .result-section {
            padding: 30px 20px;
            text-align: center;
            border-bottom: 1px solid #e9ecef;
          }

          .result-section.success {
            background: linear-gradient(135deg, #d4edda, #c3e6cb);
          }

          .result-section.error {
            background: linear-gradient(135deg, #f8d7da, #f1b0b7);
          }

          .status-icon {
            font-size: 48px;
            margin-bottom: 15px;
          }

          .status-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
            color: #2c3e50;
          }

          .status-message {
            font-size: 16px;
            line-height: 1.5;
            color: #495057;
          }

          .tessera-section {
            background: rgba(255, 255, 255, 0.3);
            border-radius: 10px;
            padding: 15px;
            margin-top: 15px;
            text-align: center;
          }

          .tessera-label {
            font-size: 14px;
            color: #495057;
            margin-bottom: 5px;
            font-weight: 500;
            opacity: 0.8;
          }

          .tessera-value {
            font-size: 18px;
            font-weight: bold;
            color: #155724;
            background: rgba(255, 255, 255, 0.5);
            padding: 8px 16px;
            border-radius: 8px;
            display: inline-block;
            border: 2px solid rgba(21, 87, 36, 0.2);
          }

          .warning-section {
            background: #fff3cd;
            border-left: 4px solid #ffeeba;
            padding: 15px 20px;
            margin-top: 15px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            gap: 10px;
            text-align: left;
          }

          .warning-icon {
            font-size: 24px;
            color: #856404;
          }

          .warning-text {
            font-size: 14px;
            color: #856404;
            line-height: 1.4;
          }

          .info-section {
            padding: 25px 20px;
            border-bottom: 1px solid #e9ecef;
          }

          .info-section h3 {
            margin: 0 0 15px 0;
            font-size: 18px;
            text-align: center;
            color: #2c3e50;
          }

          .info-section ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .info-section li {
            padding: 8px 0;
            font-size: 14px;
            color: #495057;
            border-bottom: 1px solid #f8f9fa;
          }

          .info-section li:last-child {
            border-bottom: none;
          }

          .footer {
            padding: 20px;
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
          }

          .btn {
            padding: 12px 20px;
            border-radius: 25px;
            text-decoration: none;
            font-weight: 600;
            font-size: 14px;
            transition: all 0.3s ease;
            border: none;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }

          .btn.primary {
            background: linear-gradient(135deg, #ff6b9d, #4ecdc4);
            color: white;
          }

          .btn.secondary {
            background: #f8f9fa;
            color: #495057;
            border: 2px solid #e9ecef;
          }

          .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          }

          .loading {
            text-align: center;
            padding: 40px 20px;
          }

          .spinner {
            width: 40px;
            height: 40px;
            border: 4px solid #f3f3f3;
            border-top: 4px solid #ff6b9d;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          @media (max-width: 480px) {
            .container {
              padding: 15px;
            }
            
            .header {
              padding: 25px 15px;
            }
            
            .logo {
              font-size: 40px;
            }
            
            .header h1 {
              font-size: 20px;
            }
            
            .status-icon {
              font-size: 40px;
            }
            
            .status-title {
              font-size: 20px;
            }
            
            .footer {
              flex-direction: column;
            }
            
            .btn {
              width: 100%;
              justify-content: center;
            }
          }
        `}</style>
      </div>
    </>
  );
}

function LoadingStyles() {
  return (
    <style jsx>{`
      .container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: linear-gradient(135deg, #ff6b9d 0%, #4ecdc4 50%, #45b7d1 100%);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }

      .card {
        background: white;
        border-radius: 20px;
        padding: 0;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 450px;
      }

      .loading {
        text-align: center;
        padding: 40px 20px;
      }

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid #f3f3f3;
        border-top: 4px solid #ff6b9d;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  );
}
