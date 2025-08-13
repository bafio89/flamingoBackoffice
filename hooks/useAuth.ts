import { useRouter } from 'next/router';

export const useAuth = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/login');
    } catch (error) {
      console.error('Errore durante il logout:', error);
      // In caso di errore, reindirizza comunque al login
      router.push('/login');
    }
  };

  return { logout };
};
