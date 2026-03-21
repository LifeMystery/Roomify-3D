'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TransformSection from '@/components/TransformSection';
import ViewInSpace from '@/components/ViewInSpace';
import Features from '@/components/Features';
import UploadModal from '@/components/UploadModal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modelUrl, setModelUrl] = useState(null);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <Navbar onGetStarted={openModal} />
      <Hero onUploadPhoto={openModal} onWatchDemo={scrollToHowItWorks} />
      <TransformSection modelUrl={modelUrl} />
      <ViewInSpace />
      <Features onUploadPhoto={openModal} />
      <UploadModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onUploadSuccess={(url) => setModelUrl(url)}
      />
    </>
  );
}
