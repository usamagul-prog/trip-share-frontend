import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join('');
}

const AVATAR_COLORS = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-green-500',
  'bg-teal-500', 'bg-blue-500', 'bg-indigo-500', 'bg-purple-500',
  'bg-pink-500', 'bg-rose-500',
];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

interface ProfilePhotoProps {
  src?: string;
  name: string;
  size?: 'sm' | 'default' | 'lg' | 'xl';
  className?: string;
}

const SIZE_CLASS: Record<string, string> = {
  sm: 'size-8 text-xs',
  default: 'size-10 text-sm',
  lg: 'size-16 text-lg',
  xl: 'size-24 text-2xl',
};

export default function ProfilePhoto({ src, name, size = 'default', className }: ProfilePhotoProps) {
  const initials = getInitials(name || '?');
  const color = getColor(name || '');

  return (
    <Avatar className={cn(SIZE_CLASS[size], 'shrink-0', className)}>
      {src && <AvatarImage src={src} alt={name} />}
      <AvatarFallback className={cn('text-white font-semibold', color)}>
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
