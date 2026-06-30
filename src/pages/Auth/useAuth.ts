import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { login, selectRole, type AuthUser } from "@/redux/slice/authSlice";
import { useAlert } from "@/providers";
import { PAGES } from "@/lib/constants";
import { AuthService } from "@/api";
import type { ApiError } from "@/types/api";

export type AuthStep = "method" | "otp" | "signup";

/** Multi-step auth flow wired to AuthService + authSlice (prototype-grade). */
export function useAuth() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const role = useAppSelector(selectRole);
  const { success, error } = useAlert();

  const [step, setStep] = useState<AuthStep>("method");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [accountType, setAccountType] = useState<"buyer" | "seller">("buyer");
  const [busy, setBusy] = useState(false);

  const finish = useCallback(
    (user: Partial<AuthUser>) => {
      dispatch(login(user));
      const seller = user.isSeller || user.sellerPlan;
      success(`Welcome${user.name ? `, ${user.name.split(" ")[0]}` : ""}!`);
      navigate(seller ? PAGES.DASHBOARD_SELLER : PAGES.DASHBOARD_BUYER);
    },
    [dispatch, navigate, success],
  );

  const loginAsPersona = useCallback(
    async (key: string) => {
      setBusy(true);
      try {
        const res = await AuthService.loginAsPersona(key);
        finish(res.data);
      } catch (e) {
        error((e as ApiError).message || "Couldn't sign in");
      } finally {
        setBusy(false);
      }
    },
    [finish, error],
  );

  const submitEmail = useCallback(async () => {
    if (!/.+@.+\..+/.test(email)) return;
    setBusy(true);
    try {
      await AuthService.requestOtp(email);
      setStep("otp");
    } catch (e) {
      error((e as ApiError).message || "Couldn't send the code");
    } finally {
      setBusy(false);
    }
  }, [email, error]);

  const submitOtp = useCallback(async () => {
    if (otp.length !== 6) return;
    setBusy(true);
    try {
      await AuthService.verifyOtp(email, otp);
      setStep("signup");
    } catch (e) {
      error((e as ApiError).message || "Invalid code");
    } finally {
      setBusy(false);
    }
  }, [email, otp, error]);

  const submitSignup = useCallback(async () => {
    if (!name.trim()) return;
    setBusy(true);
    try {
      const res = await AuthService.signup({ name, email, isSeller: accountType === "seller" });
      finish(res.data);
    } catch (e) {
      error((e as ApiError).message || "Couldn't create your account");
    } finally {
      setBusy(false);
    }
  }, [name, email, accountType, finish, error]);

  return {
    step,
    setStep,
    email,
    setEmail,
    otp,
    setOtp,
    name,
    setName,
    accountType,
    setAccountType,
    role,
    busy,
    loginAsPersona,
    submitEmail,
    submitOtp,
    submitSignup,
  };
}
