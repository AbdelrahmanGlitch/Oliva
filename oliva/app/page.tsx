import { Hero } from "@/components/sections/Hero";
import { Vision } from "@/components/sections/Vision";
import { FeaturedKitchen } from "@/components/sections/FeaturedKitchen";
import { Approach } from "@/components/sections/Approach";
import { CollectionShowcase } from "@/components/sections/CollectionShowcase";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { MaterialExplorer } from "@/components/sections/MaterialExplorer";
import { Craftsmanship } from "@/components/sections/Craftsmanship";
import { Functionality } from "@/components/sections/Functionality";
import { KitchenStudio } from "@/components/sections/KitchenStudio";
import { LayoutExplorer } from "@/components/sections/LayoutExplorer";
import { Personas } from "@/components/sections/Personas";
import { ProcessTimeline } from "@/components/sections/ProcessTimeline";
import { BrandStory } from "@/components/sections/BrandStory";
import { ConsultationForm } from "@/components/sections/ConsultationForm";
import { Visit } from "@/components/sections/Visit";
import { SocialGallery } from "@/components/sections/SocialGallery";

export default function Home() {
  return (
    <>
      <Hero />
      <Vision />
      <FeaturedKitchen />
      <Approach />
      <CollectionShowcase />
      <ProjectGallery />
      <MaterialExplorer />
      <Craftsmanship />
      <Functionality />
      <KitchenStudio />
      <LayoutExplorer />
      <Personas />
      <ProcessTimeline />
      <BrandStory />
      <ConsultationForm />
      <Visit />
      <SocialGallery />
    </>
  );
}
