import Image from "next/image";

const Loader = () => {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center py-16">
      <div className="relative mb-6 h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-green-200 border-t-green-600 animate-spin" />
        <div className="absolute inset-1 overflow-hidden rounded-full bg-white">
          <Image src="/sndblogo1.png" alt="SNDB" fill className="object-contain p-1.5" />
        </div>
      </div>
      <p className="text-sm font-medium text-green-700">Loading...</p>
    </div>
  );
};

export default Loader;
