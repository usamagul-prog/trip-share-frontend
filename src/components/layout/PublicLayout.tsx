import { Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="h-14 border-b px-4 flex items-center justify-between max-w-6xl mx-auto w-full">
        <Link to="/" className="text-xl font-bold text-primary">TripShare</Link>
        <nav className="flex items-center gap-4">
          <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground transition-colors">How It Works</Link>
          <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
          {token ? (
            <Link to="/trips" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
              Open App
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium hover:text-primary transition-colors">Login</Link>
              <Link to="/register" className="text-sm font-medium bg-primary text-primary-foreground px-4 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© 2026 TripShare. Intercity carpooling for Pakistan.</span>
          <div className="flex gap-6">
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link to="/how-it-works" className="hover:text-foreground transition-colors">How It Works</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
