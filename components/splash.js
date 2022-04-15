import Image from "next/image";

export default function splash() {
  return (
    <div className="splash center">
      <div>
        <div className="text-center">
          <h1>Hotspots for Trout</h1>
        </div>

        <div>
          <Image
            src="/rfconservancy.png"
            height={200}
            width={200}
            alt="Roaring Fork Conservancy"
          />
        </div>
      </div>
    </div>
  );
}
