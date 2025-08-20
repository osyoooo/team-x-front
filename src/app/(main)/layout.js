import NotificationContainer from '@/components/ui/Notification';
import Navbar from '@/components/shared/Navbar';
import BottomNav from '@/components/shared/BottomNav';
import BackgroundDesign from '@/components/shared/BackgroundDesign';

export default function MainLayout({ children }) {
  return (
    <div className="relative min-h-screen">
      <BackgroundDesign />
      <Navbar />
      <main className="pb-16 md:pb-0">{children}</main>
      <BottomNav />
      <NotificationContainer />
    </div>
  );
}