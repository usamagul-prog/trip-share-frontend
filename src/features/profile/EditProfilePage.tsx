import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthStore, AuthUser } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import api from '@/lib/api';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(60, 'Name is too long'),
});

type FormValues = z.infer<typeof schema>;

export default function EditProfilePage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuthStore();

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: user?.name ?? '' },
  });

  useEffect(() => {
    if (user) reset({ name: user.name });
  }, [user, reset]);

  const onSubmit = async (values: FormValues) => {
    try {
      const { data } = await api.put<{ user: AuthUser }>('/auth/profile', { name: values.name });
      if (data.user) updateUser({ name: data.user.name });
      toast.success('Profile updated');
      navigate('/profile');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-xl">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
        ← Back
      </Button>

      {/* Page header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-foreground">Edit Profile</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Update your display name and account details</p>
      </div>

      <Card>
        <CardContent className="pt-6 pb-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" {...register('name')} placeholder="Your full name" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Phone</Label>
              <Input value={user?.email ?? ''} disabled className="text-muted-foreground" />
            </div>
            <div className="space-y-1.5">
              <Label>Role</Label>
              <Input value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ''} disabled className="text-muted-foreground capitalize" />
              <p className="text-xs text-muted-foreground">Your email and role cannot be changed.</p>
            </div>
            <Button
              type="submit"
              className="w-full h-11 text-base font-semibold shadow-sm shadow-primary/20"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving…' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
