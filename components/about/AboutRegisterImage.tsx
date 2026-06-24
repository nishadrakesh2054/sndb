import MediaImage from "@/components/MediaImage";

const AboutRegisterImage = () => (
  <div className="mt-10 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
    <MediaImage
      src="/registerimage.jpg"
      alt="SNDB registration certificate"
      width={1200}
      height={800}
      sizes="(max-width: 768px) 100vw, 896px"
      className="block h-auto w-full object-contain"
    />
  </div>
);

export default AboutRegisterImage;
