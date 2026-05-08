import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ProfilePhoto from './components/ProfilePhoto';
import StarRating from '@/features/reviews/components/StarRating';
import api from '@/lib/api';

export default function ProfilePage() {
  const { user, clearAuth } = useAuthStore();
  const [exporting, setExporting] = useState(false);

  if (!user) return null;

  const handleExport = async () => {
    setExporting(true);
    try {
      const res = await api.get('/auth/export', { responseType: 'blob' });
      const url = URL.createObjectURL(res.data as Blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tripshare-data-${user._id}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      toast.error('Export failed. Try again later.');
    } finally {
      setExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This cannot be undone.')) return;
    try {
      await api.delete('/auth/me');
      clearAuth();
    } catch {
      toast.error('Account deletion failed. Try again later.');
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
      <Card>
        <CardContent className="pt-6 pb-6">
          <div className="flex items-center gap-4">
            <ProfilePhoto src={user.avatar_url} name={user.name} size="xl" />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold truncate">{user.name}</h1>
              <p className="text-sm text-muted-foreground capitalize">{user.role}</p>
              <p className="text-sm text-muted-foreground">{user.phone}</p>
            </div>
          </div>

          {'avg_rating' in user && (user as { avg_rating?: number }).avg_rating ? (
            <div className="mt-4 flex items-center gap-2">
              <StarRating value={(user as { avg_rating?: number }).avg_rating ?? 0} size="md" />
              <span className="text-sm text-muted-foreground">
                {(user as { avg_rating?: number }).avg_rating?.toFixed(1)}
              </span>
            </div>
          ) : null}

          <div className="mt-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/profile/edit">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-4 pb-4 space-y-3">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Data & Privacy</h2>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Download my data</p>
              <p className="text-xs text-muted-foreground">Export all your TripShare data as JSON</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={exporting}>
              <Download className="h-4 w-4 mr-1.5" />
              {exporting ? 'Exporting...' : 'Export'}
            </Button>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-destructive">Delete account</p>
              <p className="text-xs text-muted-foreground">Permanently remove all your data</p>
            </div>
            <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
              <Trash2 className="h-4 w-4 mr-1.5" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
