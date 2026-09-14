import { Skeleton } from "@/components/ui/Skeleton";
export default function Loading() { return <div className="grid gap-2 px-5 pb-24 pt-36 md:grid-cols-2 md:px-10">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-72" />)}</div>; }
