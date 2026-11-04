import { motel } from "@/data/motel";
import { BookingProvider } from "@/components/BookingRequest";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Amenities } from "@/components/Amenities";
import { Rooms } from "@/components/Rooms";
import { WhyBook } from "@/components/WhyBook";
import { Gallery } from "@/components/Gallery";
import { Welcome } from "@/components/Welcome";
import { Location } from "@/components/Location";
import { GoodToKnow } from "@/components/GoodToKnow";
import { Faq } from "@/components/Faq";
import { BookDirect } from "@/components/BookDirect";
import { Footer } from "@/components/Footer";
import { CallBar } from "@/components/CallBar";

export default function Home() {
  return (
    <BookingProvider motel={motel}>
      <Header motel={motel} />
      <main>
        <Hero motel={motel} />
        <Amenities motel={motel} />
        <Rooms motel={motel} />
        <WhyBook motel={motel} />
        <Gallery motel={motel} />
        <Welcome motel={motel} />
        <Location motel={motel} />
        <GoodToKnow motel={motel} />
        <Faq motel={motel} />
        <BookDirect motel={motel} />
      </main>
      <Footer motel={motel} />
      <CallBar motel={motel} />
    </BookingProvider>
  );
}
