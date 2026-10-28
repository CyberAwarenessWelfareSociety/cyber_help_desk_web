import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

import { isAdminUser, isTeacherUser, selectCurrentUser } from "@/store/reducer/auth";

export default function RequireTeacher() {
  const user = useSelector(selectCurrentUser);
  const isAdmin = isAdminUser(user);

  if (!isTeacherUser(user) && !isAdmin) {
    return <Navigate to="/course" replace />;
  }

  return <Outlet />;
}
