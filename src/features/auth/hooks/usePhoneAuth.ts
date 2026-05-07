export function usePhoneAuth() {
  return {
    sendOtp: async (_phone: string) => {},
    verifyOtp: async (_otp: string) => {},
  };
}
