import Contact from "@/components/home/contact/Contact";
import FleetPreview from "@/components/home/fleet-preview/FleetPreview";
import Landing from "@/components/home/landing/Landing";
import Locations from "@/components/home/locations/Locations";
import Services from "@/components/home/services/Services";
import Testimonials from "@/components/home/testimonials/Testimonials";

export default function Home() {
    return (
        <div>
            <Landing />
            <Services />
            <FleetPreview />
            <Locations />
            <Testimonials />
            <Contact />
        </div>
    );
}

