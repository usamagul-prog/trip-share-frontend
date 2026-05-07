export function useToast() {
  return {
    success: (msg: string) => console.log('✓', msg),
    error: (msg: string) => console.error('✗', msg),
  };
}
