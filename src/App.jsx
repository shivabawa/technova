import React, { useState } from 'react';
import { StoreProvider } from './context/StoreContext';
import { Preloader } from './components/Preloader';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryRail } from './components/CategoryRail';
import { ShopSection } from './components/ShopSection';
import { TodaysDeal } from './components/TodaysDeal';
import { WhyTechNova } from './components/WhyTechNova';
import { CustomerReviews } from './components/CustomerReviews';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { ToastContainer } from './components/ToastContainer';

export function AppContent() {
  const [showPreloader, setShowPreloader] = useState(true);

  return (
    <>
      {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}

      <a className="skip" href="#shop">
        Skip to products
      </a>

      <Header />

      <main id="top">
        <Hero />
        <CategoryRail />
        <ShopSection />
        <TodaysDeal />
        <WhyTechNova />
        <CustomerReviews />
        <Newsletter />
      </main>

      <Footer />

      {/* Slide-out Drawers and Modals */}
      <CartDrawer />
      <WishlistDrawer />
      <QuickViewModal />
      <CheckoutModal />
      <AuthModal />

      {/* Toast Feedback */}
      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
