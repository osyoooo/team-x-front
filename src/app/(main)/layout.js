import NotificationContainer from '@/components/ui/Notification';
import Navbar from '@/components/shared/Navbar';
import BottomNav from '@/components/shared/BottomNav';

export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pb-16 md:pb-0">{children}</main>
      <BottomNav />
      <NotificationContainer />
    </div>
  );
}