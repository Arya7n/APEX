import { Skeleton } from "@/components/ui/Skeleton";
export default function Loading() { return <div className="grid gap-4 px-5 pb-24 pt-36 md:grid-cols-2 md:px-10 xl:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="aspect-[4/3] border border-line" />)}</div>; }
