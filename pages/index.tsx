import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';

export default function Home() {
  const [id, setId] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim()) return;

    setLoading(true);
    // Reindirizza alla pagina di risultati
    router.push(`/verify-result?id=${encodeURIComponent(id.trim())}`);
  };

  return (
    <Layout title="Flamingo Surf Club - Verifica Iscrizione">
      <Head>
        <title>Flamingo Surf Club - Verifica Iscrizione</title>
        <meta name="description" content="Verifica la tua iscrizione al Flamingo Surf Club" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦩</text></svg>" />
      </Head>

      <div className="container">
        <div className="card">
          <div className="header">
            <div className="logo">🦩</div>
            <h1>Flamingo Surf Club</h1>
            <p>Verifica la tua iscrizione</p>
            <div className="wave-decoration">🌊🏄‍♀️🌊</div>
          </div>

          <form onSubmit={handleSubmit} className="form">
            <div className="input-group">
              <label htmlFor="id">Inserisci il tuo ID Socio:</label>
              <input
                id="id"
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Es: FL001234"
                disabled={loading}
                className="input"
              />
              <div className="input-hint">
                💡 Trovi il tuo ID sulla tessera associativa
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !id.trim()}
              className="button"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Verificando...
                </>
              ) : (
                <>
                  🔍 Verifica Iscrizione
                </>
              )}
            </button>
          </form>

          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">🌺</div>
              <div className="info-text">
                <strong>Soci Attivi</strong>
                <p>Accesso completo alle attività</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">🏄‍♀️</div>
              <div className="info-text">
                <strong>Lezioni Surf</strong>
                <p>Per chi fa il bravo</p>
              </div>
            </div>
          </div>

          <div className="footer">
            <p>🌺 Ride the wave with style! 🌺</p>
            <div className="contact-info">
              <small>
                📧 info@flamingosurfclub.it | 📱 +39 123 456 7890
              </small>
            </div>
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
            padding: 40px 30px;
            position: relative;
          }

          .logo {
            font-size: 64px;
            margin-bottom: 15px;
            animation: float 3s ease-in-out infinite;
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
          }

          .header h1 {
            margin: 0 0 10px 0;
            font-size: 28px;
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }

          .header p {
            margin: 0 0 15px 0;
            font-size: 18px;
            opacity: 0.9;
          }

          .wave-decoration {
            font-size: 24px;
            opacity: 0.8;
          }

          .form {
            padding: 30px;
          }

          .input-group {
            margin-bottom: 25px;
          }

          .input-group label {
            display: block;
            margin-bottom: 10px;
            color: #2c3e50;
            font-weight: 600;
            font-size: 16px;
          }

          .input {
            width: 100%;
            padding: 18px;
            border: 3px solid #e1e8ed;
            border-radius: 15px;
            font-size: 18px;
            font-weight: 500;
            transition: all 0.3s ease;
            box-sizing: border-box;
            text-align: center;
            font-family: 'Courier New', monospace;
          }

          .input:focus {
            outline: none;
            border-color: #ff6b9d;
            box-shadow: 0 0 0 4px rgba(255, 107, 157, 0.1);
            transform: translateY(-2px);
          }

          .input:disabled {
            background-color: #f8f9fa;
            cursor: not-allowed;
          }

          .input-hint {
            margin-top: 8px;
            font-size: 14px;
            color: #6c757d;
            text-align: center;
            font-style: italic;
          }

          .button {
            width: 100%;
            padding: 18px;
            background: linear-gradient(135deg, #ff6b9d, #4ecdc4);
            color: white;
            border: none;
            border-radius: 15px;
            font-size: 18px;
            font-weight: 700;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
          }

          .button:hover:not(:disabled) {
            transform: translateY(-3px);
            box-shadow: 0 15px 30px rgba(255, 107, 157, 0.4);
          }

          .button:disabled {
            opacity: 0.7;
            cursor: not-allowed;
            transform: none;
            box-shadow: none;
          }

          .spinner {
            width: 20px;
            height: 20px;
            border: 2px solid rgba(255,255,255,0.3);
            border-top: 2px solid white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }

          .info-cards {
            padding: 20px 30px;
            background: #f8f9fa;
            border-top: 1px solid #e9ecef;
            border-bottom: 1px solid #e9ecef;
          }

          .info-card {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px 0;
            border-bottom: 1px solid #e9ecef;
          }

          .info-card:last-child {
            border-bottom: none;
          }

          .info-icon {
            font-size: 32px;
            width: 50px;
            text-align: center;
          }

          .info-text strong {
            display: block;
            color: #2c3e50;
            font-size: 16px;
            margin-bottom: 4px;
          }

          .info-text p {
            margin: 0;
            color: #6c757d;
            font-size: 14px;
          }

          .footer {
            padding: 25px 30px;
            text-align: center;
          }

          .footer p {
            margin: 0 0 10px 0;
            color: #7f8c8d;
            font-size: 16px;
            font-style: italic;
            font-weight: 500;
          }

          .contact-info {
            color: #adb5bd;
            font-size: 12px;
          }

          @media (max-width: 480px) {
            .container {
              padding: 15px;
            }
            
            .card {
              border-radius: 15px;
            }
            
            .header {
              padding: 30px 20px;
            }
            
            .logo {
              font-size: 48px;
            }
            
            .header h1 {
              font-size: 24px;
            }
            
            .header p {
              font-size: 16px;
            }
            
            .form {
              padding: 25px 20px;
            }
            
            .input, .button {
              padding: 15px;
              font-size: 16px;
            }
            
            .info-cards {
              padding: 15px 20px;
            }
            
            .footer {
              padding: 20px;
            }
          }
        `}</style>
      </div>
    </Layout>
  );
}
