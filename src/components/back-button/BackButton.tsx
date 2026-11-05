import { PropsWithChildren } from "react";
import Button from "../button";
import { useRouter } from "@tanstack/react-router";

type BackButtonProps = {
  mod?: string;
} & PropsWithChildren;

export const BackButton = ({ mod, children }: BackButtonProps) => {
  const router = useRouter();

  const goBack = () => {
    if (router.history.canGoBack()) {
      router.history.back();
    } else {
      router.navigate({ to: "/" });
    }
  };

  return (
    <Button mod={mod || "wide cancel"} onClick={goBack}>
      {children}
    </Button>
  );
};
