import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        html,
        body {
          max-width: 100vw;
          overflow-x: hidden;
        }

        body {
          color: rgb(var(--foreground-rgb));
          background: linear-gradient(
            to bottom,
            transparent,
            rgb(var(--background-end-rgb))
          )
          rgb(var(--background-start-rgb));
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        @media (prefers-color-scheme: dark) {
          html {
            color-scheme: dark;
          }
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}
