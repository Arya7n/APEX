import { Skeleton } from "@/components/ui/Skeleton";
export default function Loading() { return <div className="px-5 pb-24 pt-36 md:px-10"><Skeleton className="h-16 max-w-xl" /><Skeleton className="mx-auto mt-10 aspect-[16/9] max-w-5xl" /><div className="mt-10 grid gap-2 md:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-24" />)}</div></div>; }
