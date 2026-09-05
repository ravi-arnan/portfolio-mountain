import { getAllProjects } from "@/lib/content";
import HomeChoreography from "@/components/home/HomeChoreography";
import Hero from "@/components/home/Hero";
import Flyover from "@/components/home/Flyover";
import SelectedWork from "@/components/home/SelectedWork";
import Capabilities from "@/components/home/Capabilities";
import ContactCTA from "@/components/home/ContactCTA";

export default function Home() {
  const projects = getAllProjects().filter((p) => p.featured).slice(0, 3);
  return (
    <main>
      <HomeChoreography />
      <Hero />
      <Flyover />
      <SelectedWork projects={projects} />
      <Capabilities />
      <ContactCTA />
    </main>
  );
}
