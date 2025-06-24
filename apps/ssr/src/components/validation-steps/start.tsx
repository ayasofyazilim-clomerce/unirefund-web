import Image from "next/image";
import PassportMockup from "public/passport-mockup.png";

export default function Start() {
  return (
    <div className=" md:h-auto">
      <div className="relative flex w-full justify-center overflow-hidden p-4">
        <Image alt="Scan Placeholder" height={300} priority src={PassportMockup.src} width={400} />
      </div>
      {/* Pass languageData to client component */}
    </div>
  );
}
