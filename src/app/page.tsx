import Image from "next/image";

export default function Page() {
  return (
    <main className="max-w-screen-xl mx-auto flex items-center justify-center min-h-screen p-4">
      <div className="text-center">
        <Image
          src="/profile.jpg"
          width={256}
          height={256}
          alt="Åke"
          className="rounded-full mx-auto"
        />
        <h1 className="text-4xl font-bold tracking-tighter my-4">Åke Amcoff</h1>
        <a
          href="https://github.com/akeamc"
          className="text-gray-700 hover:underline"
        >
          GitHub (@akeamc)
        </a>
      </div>
    </main>
  );
}
