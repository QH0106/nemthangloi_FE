import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";



export default function PrivateRoute({ validateFn, redirectTo = "/login" }) {
  const location = useLocation();
  const [isAllowed, setIsAllowed] = useState(null);

  useEffect(() => {
    let mounted = true;

    const runValidation = async () => {
      try {
        const result = await Promise.resolve(validateFn());
        if (mounted) setIsAllowed(Boolean(result));
      } catch {
        if (mounted) setIsAllowed(false);
      }
    };

    runValidation();

    return () => {
      mounted = false;
    };
  }, [validateFn]);

  if (isAllowed === null) {
    return null;
  }

  if (!isAllowed) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
