import Navbar from './Navbar';
import BottomNav from './BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content" className="pb-20 md:pb-6 pt-4">{children}</main>
      <BottomNav />
    </div>
  );
}
