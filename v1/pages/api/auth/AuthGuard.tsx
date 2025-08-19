import InitialLoader from "@/components/InitialLoader";
import { LoadingContext } from "@/context/LoadingContext";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

export function AuthGuard({ children }: { children: JSX.Element }) {
  const { loadingStatus, setLoadingStatus } = useContext(LoadingContext);
  const router = useRouter();
  const token = Cookies.get("access_token");

  useEffect(() => {
    if (loadingStatus) {
      if (!token) {
        router.replace("/");
      } else {
        setLoadingStatus(false);
      }
    }
  }, [router, token, loadingStatus, setLoadingStatus]);

  if (loadingStatus) {
    return <InitialLoader />;
  }

  // if auth initialized with a valid user show protected page
  if (token) {
    return <>{children}</>;
  }

  /* otherwise don't return anything, will do a redirect from useEffect */
  return null;
}
