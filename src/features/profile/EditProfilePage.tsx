import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore, AuthUser } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';

const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name is too long'),
});

const passwordSchema = z
  .object({
    current_password: z.string().min(1, 'Current password is required'),
    new_password: z.string().min(8, 'New password must be at least 8 characters'),
    confirm_password: z.string().min(1, 'Please confirm your new password'),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  });

type ProfileValues = z.infer<typeof profileSchema>;
type PasswordValues = z.infer<typeof passwordSchema>;

function EyeToggle({ show, onToggle }: { show: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
      tabIndex={-1}
    >
      {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
    </button>
  );
}

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();

  const profileForm = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '' },
  });

  const passwordForm = useForm<PasswordValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { current_password: '', new_password: '', confirm_password: '' },
  });

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (user) profileForm.reset({ name: user.name });
  }, [user, profileForm]);

  const onProfileSubmit = async (values: ProfileValues) => {
    try {
      const { data } = await api.put<{ user: AuthUser }>('/auth/profile', { name: values.name });
      if (data.user) updateUser({ name: data.user.name });
      toast.success('Profile updated');
      navigate('/profile');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const onPasswordSubmit = async (values: PasswordValues) => {
    try {
      await api.put('/auth/password', {
        current_password: values.current_password,
        new_password: values.new_password,
      });
      toast.success('Password updated');
      passwordForm.reset();
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      toast.error(status === 401 ? 'Current password is incorrect' : 'Failed to update password');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-xl space-y-6">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-2">
        ← Back
      </Button>

      <div>
        <h1 className="text-2xl font-bold text-foreground">Edit Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Update your display name and password</p>
      </div>

      {/* Profile name */}
      <Card>
        <CardContent className="pt-6 pb-6">
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...profileForm.register('name')} placeholder="Your full name" />
              {profileForm.formState.errors.name && (
                <p className="text-xs text-destructive">{profileForm.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label>Email</Label>
              <Input value={user?.email ?? ''} disabled className="text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Email and role cannot be changed.</p>
            </div>
            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold"
              disabled={profileForm.formState.isSubmitting}
            >
              {profileForm.formState.isSubmitting ? 'Saving…' : 'Save Name'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Change password */}
      <Card>
        <CardContent className="pt-6 pb-6">
          <h2 className="text-base font-semibold mb-4">Change Password</h2>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="current_password">Current Password</Label>
              <div className="relative">
                <Input
                  id="current_password"
                  type={showCurrent ? 'text' : 'password'}
                  {...passwordForm.register('current_password')}
                  placeholder="Enter current password"
                  className="pr-10"
                />
                <EyeToggle show={showCurrent} onToggle={() => setShowCurrent((v) => !v)} />
              </div>
              {passwordForm.formState.errors.current_password && (
                <p className="text-xs text-destructive">{passwordForm.formState.errors.current_password.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="new_password">New Password</Label>
              <div className="relative">
                <Input
                  id="new_password"
                  type={showNew ? 'text' : 'password'}
                  {...passwordForm.register('new_password')}
                  placeholder="At least 8 characters"
                  className="pr-10"
                />
                <EyeToggle show={showNew} onToggle={() => setShowNew((v) => !v)} />
              </div>
              {passwordForm.formState.errors.new_password && (
                <p className="text-xs text-destructive">{passwordForm.formState.errors.new_password.message}</p>
              )}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm_password">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirm_password"
                  type={showConfirm ? 'text' : 'password'}
                  {...passwordForm.register('confirm_password')}
                  placeholder="Repeat new password"
                  className="pr-10"
                />
                <EyeToggle show={showConfirm} onToggle={() => setShowConfirm((v) => !v)} />
              </div>
              {passwordForm.formState.errors.confirm_password && (
                <p className="text-xs text-destructive">{passwordForm.formState.errors.confirm_password.message}</p>
              )}
            </div>
            <Button
              type="submit"
              variant="outline"
              className="w-full h-11 text-base font-semibold"
              disabled={passwordForm.formState.isSubmitting}
            >
              {passwordForm.formState.isSubmitting ? 'Updating…' : 'Update Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
