import { WeatherSearchView } from "@/components/weather-search-view";

export default function Home() {
  return (
    <main className="bg-[url('/bg-light.png')] bg-no-repeat">
      <div className="flex flex-col max-w-[700px] mx-auto min-h-screen pt-5 px-4">
        <WeatherSearchView />
      </div>
    </main>
  );
}
