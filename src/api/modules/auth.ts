/**
 * Auth flows. Each returns a user payload (with a `token`) that the caller hands
 * to `authSlice.login(...)`. Mock resolves personas from DEMO_PERSONAS; the OTP
 * steps just validate. Swap to the real backend by flipping VITE_USE_MOCK_API.
 */
import { apiClient } from "../client";
import { AppUrl } from "../endpoints";
import type { ApiResponseType } from "@/types/api";
import type { AuthUser } from "@/redux/slice/authSlice";

export interface SignupPayload {
  name: string;
  email: string;
  isSeller: boolean;
}

export const AuthService = {
  loginAsPersona(key: string): Promise<ApiResponseType<Partial<AuthUser>>> {
    return apiClient.post<Partial<AuthUser>>(AppUrl.authPersona, { key });
  },
  requestOtp(email: string): Promise<ApiResponseType<{ sent: boolean }>> {
    return apiClient.post<{ sent: boolean }>(AppUrl.authOtpRequest, { email });
  },
  verifyOtp(email: string, otp: string): Promise<ApiResponseType<{ valid: boolean }>> {
    return apiClient.post<{ valid: boolean }>(AppUrl.authOtpVerify, { email, otp });
  },
  signup(payload: SignupPayload): Promise<ApiResponseType<Partial<AuthUser>>> {
    return apiClient.post<Partial<AuthUser>>(AppUrl.authSignup, payload);
  },
};
