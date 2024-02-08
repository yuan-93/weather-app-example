import { WeatherSearchView } from "@/components/weather-search-view";

export default function Home() {
  return (
    <main className="bg-[url('/bg-light.png')]">
      <div className="flex flex-col py-2 px-2 gap-2 max-w-[700px] mx-auto min-h-screen">
        <section>
          <WeatherSearchView />
        </section>
      </div>
    </main>
  );
}
