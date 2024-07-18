import { store } from "@/redux/store";
import { ReactNode } from "react";
import { Provider } from "react-redux";

export function Providers({children}: {children: ReactNode}) {
  return <Provider store={store}>{children}</Provider>
}
