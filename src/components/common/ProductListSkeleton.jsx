import ProductCardSkeleton from "./ProductCardSkeleton";

export default function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Array.from(new Array(8)).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}