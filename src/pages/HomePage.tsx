import React from 'react';
import { Section1Hero } from '../components/sections/Section1Hero';
import { SectionFeaturedProducts } from '../components/sections/SectionFeaturedProducts';
import { Section2ExplodedSticky } from '../components/sections/Section2ExplodedSticky';
import { Section3VerticalsGallery } from '../components/sections/Section3VerticalsGallery';
import { Section4HorizontalSticky } from '../components/sections/Section4HorizontalSticky';
import { Section5EcosystemBrands } from '../components/sections/Section5EcosystemBrands';
import { Section6WorkflowSticky } from '../components/sections/Section6WorkflowSticky';
import { SectionReviewsMarquee } from '../components/sections/SectionReviewsMarquee';
import { Section7FinalMonolith } from '../components/sections/Section7FinalMonolith';

export const HomePage: React.FC = () => {
  return (
    <main>
      <Section1Hero />
      <SectionFeaturedProducts />
      <Section2ExplodedSticky />
      <Section3VerticalsGallery />
      <Section4HorizontalSticky />
      <Section5EcosystemBrands />
      <Section6WorkflowSticky />
      <SectionReviewsMarquee />
      <Section7FinalMonolith />
    </main>
  );
};
