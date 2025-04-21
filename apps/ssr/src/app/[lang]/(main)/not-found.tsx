"use client";
import {FileLock2} from "lucide-react";

export default function Page() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-screen-md px-4 py-8 text-center lg:px-12 lg:py-16">
        <FileLock2 className="mx-auto mb-4 h-20 w-20 text-gray-400" />
        <h1 className="mb-4 text-4xl font-bold leading-none tracking-tight text-gray-900 md:text-5xl lg:mb-6 xl:text-6xl">
          Something went wrong!
        </h1>
        <p className="font-light text-gray-500 md:text-lg xl:text-xl">
          Sorry, there is a problem on our side. Please try again later.
        </p>
      </div>
    </section>
  );
}
