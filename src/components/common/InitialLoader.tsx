import { useEffect } from "react";
import { useLoader } from "../../context/LoaderContext";

export const InitialLoader = () => {
  const { showLoader, hideLoader } = useLoader();

  useEffect(() => {
    showLoader();
    const timer = setTimeout(() => {
      hideLoader();
    }, 2000); // Show loader for 2 seconds on first mount

    return () => clearTimeout(timer);
  }, [showLoader, hideLoader]);

  return null;
};
