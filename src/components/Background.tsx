import { useExpenseStore } from "@/store/useExpenseStore";

export default function Background() {
  const { currentVideo, backgroundOverlayOpacity } = useExpenseStore();

  return (
    <div className="fixed inset-0 -z-10">
      <video
        src={currentVideo}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      />
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(0,0,0,${backgroundOverlayOpacity})` }} 
      />
    </div>
  );
}
