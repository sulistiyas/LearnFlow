import axios from 'axios';
import Swal from 'sweetalert2';

const getApiBaseUrl = (): string => {
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof window !== 'undefined' && window.location.origin) {
    return `${window.location.origin}/api/v1`;
  }
  return 'http://localhost:8000/api/v1';
};

export const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  withXSRFToken: true,
});

/**
 * Initialize CSRF cookie for Sanctum SPA authentication
 */
export const initializeCsrf = async (): Promise<void> => {
  const backendBase = import.meta.env.VITE_API_BASE_URL
    ? import.meta.env.VITE_API_BASE_URL.replace(/\/api\/v1\/?$/, '')
    : (typeof window !== 'undefined' && window.location.origin ? window.location.origin : 'http://localhost:8000');
  await axios.get(`${backendBase}/sanctum/csrf-cookie`, { withCredentials: true });
};

// Response Interceptor for Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      if (status === 401) {
        Swal.fire({
          icon: 'warning',
          title: 'Sesi Berakhir',
          text: 'Sesi Anda telah kedaluwarsa. Silakan masuk kembali.',
          confirmButtonColor: '#3b82f6',
        });
      } else if (status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Akses Ditolak',
          text: data?.message || 'Anda tidak memiliki hak akses untuk tindakan ini.',
          confirmButtonColor: '#ef4444',
        });
      } else if (status === 422) {
        // Validation errors
      } else if (status >= 500) {
        Swal.fire({
          icon: 'error',
          title: 'Kesalahan Server',
          text: 'Terjadi kendala pada server backend. Silakan coba sesaat lagi.',
          confirmButtonColor: '#6b7280',
        });
      }
    } else if (error.request) {
      Swal.fire({
        icon: 'error',
        title: 'Koneksi Terputus',
        text: 'Tidak dapat terhubung ke server LearnFlow. Periksa jaringan internet Anda.',
        confirmButtonColor: '#e11d48',
      });
    }

    return Promise.reject(error);
  }
);
