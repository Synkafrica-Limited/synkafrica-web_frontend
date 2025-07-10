export default function PortfolioGrid({ images }) {
  return (
    <div className="grid grid-cols-2 gap-2 rounded-xl overflow-hidden">
      {images.map((img, i) => (
        <img key={i} src={img} alt="portfolio" className="object-cover w-full h-32" />
      ))}
    </div>
  );
}