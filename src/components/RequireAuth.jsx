import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import {
  selectAuthLoading,
  selectCurrentToken,
  selectCurrentUser,
} from "@/store/reducer/auth";

export default function RequireAuth() {
  const token = useSelector(selectCurrentToken);
  const user = useSelector(selectCurrentUser);
  const isLoading = useSelector(selectAuthLoading);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-[50vh] grid place-items-center" role="status">
        <p className="text-sm font-medium text-slate-600">Checking your session…</p>
      </div>
    );
  }

  if (!token || !user?.id) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
