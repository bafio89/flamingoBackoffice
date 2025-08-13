import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'Flamingo Backoffice' }: LayoutProps) {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <main>
        {children}
      </main>
    </div>
  );
}
