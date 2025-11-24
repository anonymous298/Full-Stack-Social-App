import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { ScrollArea } from "../ui/scroll-area";

const items = Array.from({ length: 5 }).map((_, i) => i);

const SkeletonCard = () => {
  return (
    <div>
      <Card>
        <CardHeader className="flex justify-between items-center border-b">
          <CardTitle>Notifications</CardTitle>

          <Skeleton className="h-4 w-[100px]" />
        </CardHeader>

        <CardContent>
          <ScrollArea className="w-full h-[calc(100vh-12rem)]">
            {items.map((idx) => {
                return (
                    <div key={idx} className="flex items-start gap-4 p-4 border-b">
                        <Skeleton className="h-10 w-10 rounded-full" />

                        <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2">
                            <Skeleton className="h-4 w-4" />
                            <Skeleton className="h-4 w-40" />
                            </div>
                            <div className="pl-6 space-y-2">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-4 w-24" />
                            </div>
                        </div>
                    </div>
                )
            })}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default SkeletonCard;
