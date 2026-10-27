import React, { type ReactNode } from 'react';
import { useAuthStore } from '../stores/authStore';
import { ShieldX } from 'lucide-react';

interface RoleGateProps {
  allowedRoles: string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export const RoleGate: React.FC<RoleGateProps> = ({ allowedRoles, fallback, children }) => {
  const { hasRole, isAuthenticated } = useAuthStore();

  if (!isAuthenticated || !hasRole(allowedRoles)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-700 flex items-center gap-3 text-xs font-medium">
        <ShieldX className="h-5 w-5 text-rose-500 shrink-0" />
        <span>Fitur ini dibatasi hanya untuk peran: <b>{allowedRoles.join(', ')}</b>.</span>
      </div>
    );
  }

  return <>{children}</>;
};
