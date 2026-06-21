export function MapEmbed({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden border border-hairline bg-surface ${className}`}>
      <iframe
        title="Map showing Karachi, Pakistan"
        src="https://www.openstreetmap.org/export/embed.html?bbox=66.806%2C24.735%2C67.196%2C25.045&layer=mapnik&marker=24.8607%2C67.0011"
        className="h-full w-full grayscale invert"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
}
