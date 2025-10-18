import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export const ExploreLoader = () => {
  return (
    <div className="grid-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="w-full aspect-square rounded-lg" />
      ))}
    </div>
  );
};

export const PublicationLoader = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      
    </div>
  )
}

// Profile Loader
export const ProfileLoader = () => {
  return (
    <section className="section-flex container mx-auto max-w-6xl">
      <div className="flex-between my-6">
        <Skeleton className="h-8 w-32 rounded" />
        <Skeleton className="h-8 w-8 rounded" />
      </div>
      <Separator className="bg-muted my-4" />
      <div className="flex-column gap-4">
        <div className="flex-between">
          <div className="flex flex-col gap-2 w-full">
            <Skeleton className="h-6 w-40 rounded" />
            <Skeleton className="h-4 w-24 rounded" />
          </div>
          <div className="flex-end w-full h-full">
            <Skeleton className="w-16 h-16 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-4 w-3/4 rounded" />
      </div>
      <Separator className="bg-muted my-4" />
      <div className="flex-around">
        <div className="flex-column flex-center gap-2">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-3 w-8 rounded" />
        </div>
        <div className="flex-column flex-center gap-2">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-3 w-8 rounded" />
        </div>
        <div className="flex-column flex-center gap-2">
          <Skeleton className="h-4 w-16 rounded" />
          <Skeleton className="h-3 w-8 rounded" />
        </div>
      </div>
      <Separator className="bg-muted my-4" />
      <div className="grid-default gap-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="w-full aspect-square rounded-lg" />
        ))}
      </div>
    </section>
  );
};