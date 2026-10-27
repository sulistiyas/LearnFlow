import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiClient, initializeCsrf } from '../lib/api';
import Swal from 'sweetalert2';

export interface UserProfile {
  id: string;
  name: string;
  username: string | null;
  email: string;
  phone_number?: string | null;
  avatar_url?: string | null;
  student_code?: string | null;
  status: string;
  last_login_at?: string | null;
}

interface AuthState {
  user: UserProfile | null;
  roles: string[];
  permissions: string[];
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (identifier: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  updateUser: (updated: Partial<UserProfile>) => void;
  hasRole: (rolesToCheck: string | string[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      roles: [],
      permissions: [],
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (identifier: string, password: string): Promise<boolean> => {
        set({ isLoading: true });
        try {
          await initializeCsrf().catch(() => {});
          const response = await apiClient.post('/auth/login', {
            identifier,
            password,
          });

          if (response.data.success) {
            const { user, roles, permissions, token } = response.data.data;
            set({
              user,
              roles: roles || [],
              permissions: permissions || [],
              token: token || null,
              isAuthenticated: true,
              isLoading: false,
            });

            if (token) {
              apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            }

            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: `Selamat datang, ${user.name}!`,
              showConfirmButton: false,
              timer: 3000,
            });

            return true;
          }
          return false;
        } catch (error: any) {
          set({ isLoading: false });
          const msg = error.response?.data?.message || 'Kredensial tidak valid.';
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'error',
            title: msg,
            showConfirmButton: false,
            timer: 4000,
          });
          return false;
        }
      },

      logout: async () => {
        try {
          await apiClient.post('/auth/logout');
        } catch {
          // ignore error on logout
        } finally {
          delete apiClient.defaults.headers.common['Authorization'];
          set({
            user: null,
            roles: [],
            permissions: [],
            token: null,
            isAuthenticated: false,
          });
          Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'info',
            title: 'Anda telah keluar dari sesi.',
            showConfirmButton: false,
            timer: 3000,
          });
        }
      },

      fetchUser: async () => {
        try {
          const res = await apiClient.get('/auth/me');
          if (res.data.success) {
            const { user, roles, permissions } = res.data.data;
            set({
              user,
              roles: roles || [],
              permissions: permissions || [],
              isAuthenticated: true,
            });
          }
        } catch {
          set({
            user: null,
            roles: [],
            permissions: [],
            token: null,
            isAuthenticated: false,
          });
        }
      },

      updateUser: (updated) => {
        const current = get().user;
        if (current) {
          set({ user: { ...current, ...updated } });
        }
      },

      hasRole: (rolesToCheck) => {
        const currentRoles = get().roles;
        if (Array.isArray(rolesToCheck)) {
          return rolesToCheck.some((r) => currentRoles.includes(r));
        }
        return currentRoles.includes(rolesToCheck);
      },

      hasPermission: (permission) => {
        return get().permissions.includes(permission);
      },
    }),
    {
      name: 'learnflow-auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        roles: state.roles,
        permissions: state.permissions,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
