import { Card } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";

export default function ProductCardSkeleton() {
  return (
    <Card className="p-3 rounded-xl shadow-sm">
      {/* Image */}
      <Skeleton
        variant="rectangular"
        className="rounded-lg"
        height={220}
        animation="wave"
      />

      {/* Price */}
      <div className="mt-3 space-y-1">
        <Skeleton variant="text" width="40%" height={20} animation="wave" />
        <Skeleton variant="text" width="60%" height={28} animation="wave" />
      </div>

      {/* Product name */}
      <div className="mt-2">
        <Skeleton variant="text" width="90%" height={22} animation="wave" />
        <Skeleton variant="text" width="70%" height={22} animation="wave" />
      </div>
    </Card>
  );
}