/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface RequireAuthProps {
  children: ReactNode;
  roles?: string[]; // Roles autorisés
  permissions?: string[]; // Permissions autorisées
}

export default function RequireAuth({
  children,
  roles,
  permissions,
}: RequireAuthProps) {
  const profile = useSelector((state: any) => state.profile.data);

  if (roles && !roles.includes(profile.role)) {
    return <Navigate to="/unauthorized" replace />; // rôle non autorisé
  }

  if (permissions) {
    const userPerms = profile.permissions || [];
    const hasPermission = permissions.some((p) => userPerms.includes(p));
    if (!hasPermission) return <Navigate to="/unauthorized" replace />; // pas de permission
  }

  return <>{children}</>; // autorisé
}
