interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
}
export default function Button({ children, loading, ...props }: ButtonProps) {
  return <button {...props}>{loading ? '...' : children}</button>;
}
