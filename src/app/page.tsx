import { WeatherSearchView } from "@/components/weather-search-view";

export default function Home() {
  return (
    <main className="flex flex-col py-2 px-2 gap-2">
      <h1 className="text-2xl font-bold">Today&apos;s Weather</h1>
      <hr className="h-0.5 bg-black/50" />
      <section>
        <WeatherSearchView />
      </section>
    </main>
  );
}
