import { useExpenseStore } from "@/store/useExpenseStore";

export default function Background() {
  const { backgroundType, currentVideo, backgroundColor } = useExpenseStore();

  return (
    <div className="fixed inset-0 -z-10">
      {backgroundType === 'video' ? (
        <video
          src={currentVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div 
          className="w-full h-full"
          style={{ backgroundColor }}
        />
      )}
      {backgroundType === 'video' && (
        <div className="absolute inset-0 bg-black/20" />
      )}
    </div>
  );
}
