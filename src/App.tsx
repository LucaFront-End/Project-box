import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { BoxProvider } from './context/BoxContext';
import { ScrollProgressBar } from './components/ui/ScrollProgressBar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/layout/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { StorePage } from './pages/StorePage';
import { VerticalPage } from './pages/VerticalPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { SystemDetailPage } from './pages/SystemDetailPage';
import { CommandSearchModal } from './components/modals/CommandSearchModal';
import { ProjectBoxDrawer } from './components/modals/ProjectBoxDrawer';
import { DistributorModal } from './components/modals/DistributorModal';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <BoxProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-white text-obsidian selection:bg-signal/20">
          <ScrollProgressBar />
          <Navbar />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tienda" element={<StorePage />} />
            <Route path="/especialidad/:verticalId" element={<VerticalPage />} />
            <Route path="/producto/:sku" element={<ProductDetailPage />} />
            <Route path="/sistema/:code" element={<SystemDetailPage />} />
            <Route path="*" element={<HomePage />} />
          </Routes>

          <Footer />

          {/* Global Interactive Overlays */}
          <CommandSearchModal />
          <ProjectBoxDrawer />
          <DistributorModal />
        </div>
      </BoxProvider>
    </BrowserRouter>
  );
};

export default App;
