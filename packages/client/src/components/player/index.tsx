import dynamic from "next/dynamic";
import Spinner from "@/components/ui/spinner";

export { default } from "./Player";

export const LazyPlayer = dynamic(() => import("./Player"), {
    loading: () => <Spinner />,
    ssr: false,
});