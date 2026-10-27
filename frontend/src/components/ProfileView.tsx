import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '../stores/authStore';
import { apiClient } from '../lib/api';
import Swal from 'sweetalert2';
import { User, Phone, Upload, Camera, Save, Lock } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Nama lengkap minimal 2 karakter').max(150),
  username: z.string().min(3, 'Username minimal 3 karakter').max(50).nullable().optional(),
  phone_number: z.string().max(30).nullable().optional(),
  password: z.string().min(8, 'Password baru minimal 8 karakter').optional().or(z.literal('')),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export const ProfileView: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name ?? '',
      username: user?.username ?? '',
      phone_number: user?.phone_number ?? '',
      password: '',
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setIsSaving(true);
    try {
      const payload: Record<string, any> = {
        name: values.name,
        username: values.username || null,
        phone_number: values.phone_number || null,
      };
      if (values.password && values.password.length >= 8) {
        payload.password = values.password;
        payload.password_confirmation = values.password;
      }

      const res = await apiClient.put('/profile', payload);
      if (res.data.success) {
        updateUser(res.data.data.user);
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Profil berhasil diperbarui!',
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal memperbarui profil.';
      Swal.fire({
        icon: 'error',
        title: 'Gagal Simpan',
        text: msg,
        confirmButtonColor: '#ea580c',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: 'warning',
        title: 'Ukuran Berkas Terlalu Besar',
        text: 'Batas maksimal ukuran foto avatar adalah 2 MB.',
        confirmButtonColor: '#f97316',
      });
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setIsUploading(true);
    try {
      const res = await apiClient.post('/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        const { avatar_url } = res.data.data;
        updateUser({ avatar_url });
        Swal.fire({
          toast: true,
          position: 'top-end',
          icon: 'success',
          title: 'Foto avatar berhasil diunggah ke Cloud Storage!',
          showConfirmButton: false,
          timer: 3500,
        });
      }
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Gagal mengunggah foto avatar.';
      Swal.fire({
        icon: 'error',
        title: 'Gagal Unggah',
        text: msg,
        confirmButtonColor: '#ea580c',
      });
    } finally {
      setIsUploading(false);
    }
  };

  if (!user) {
    return (
      <div className="rounded-xl border border-sky-100 bg-white p-6 text-center text-xs text-slate-500 shadow-sm">
        Silakan masuk terlebih dahulu untuk mengelola profil pengguna.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-sky-100 bg-white p-4 sm:p-6 space-y-5 sm:space-y-6 shadow-sm hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5 sm:gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3.5 sm:gap-4">
          <div className="relative group shrink-0">
            <div className="h-14 sm:h-16 w-14 sm:w-16 rounded-2xl bg-sky-50 border-2 border-sky-300 overflow-hidden flex items-center justify-center shadow-md shadow-sky-500/10 ring-2 ring-sky-100">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <span className="text-lg sm:text-xl font-bold text-sky-700">{user.name.charAt(0)}</span>
              )}
            </div>
            <label className="absolute inset-0 bg-slate-900/60 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition cursor-pointer">
              <Camera className="h-5 w-5 text-white" />
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleAvatarChange}
                disabled={isUploading}
                className="hidden"
              />
            </label>
          </div>

          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">{user.name}</h3>
            <p className="text-xs text-slate-500 font-mono truncate">{user.email}</p>
            {isUploading && (
              <span className="text-[11px] text-sky-600 font-semibold animate-pulse block">
                Mengunggah & mengompresi ke R2...
              </span>
            )}
          </div>
        </div>

        <label className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-3.5 py-2 sm:py-1.5 rounded-xl bg-white hover:bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-200 shadow-2xs cursor-pointer transition active:scale-[0.98] touch-manipulation">
          <Upload className="h-3.5 w-3.5 text-sky-600" />
          <span>Ganti Foto Avatar</span>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleAvatarChange}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-sky-600" />
              Nama Lengkap:
            </label>
            <input
              type="text"
              {...register('name')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-3 focus:ring-sky-500/15 transition font-medium"
            />
            {errors.name && <p className="text-[11px] text-rose-500 font-medium">{errors.name.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-sky-600" />
              Username:
            </label>
            <input
              type="text"
              {...register('username')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-3 focus:ring-sky-500/15 transition font-medium"
            />
            {errors.username && <p className="text-[11px] text-rose-500 font-medium">{errors.username.message}</p>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-sky-600" />
              Nomor Telepon:
            </label>
            <input
              type="text"
              placeholder="+628123456789"
              {...register('phone_number')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-3 focus:ring-sky-500/15 transition font-medium"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-sky-600" />
              Ubah Password (Kosongkan jika tidak diganti):
            </label>
            <input
              type="password"
              placeholder="Minimal 8 karakter"
              {...register('password')}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm sm:text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-sky-500 focus:ring-3 focus:ring-sky-500/15 transition font-medium"
            />
            {errors.password && <p className="text-[11px] text-rose-500 font-medium">{errors.password.message}</p>}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="w-full sm:w-auto min-h-[44px] inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 transition disabled:opacity-50 active:scale-[0.98] touch-manipulation"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  );
};
