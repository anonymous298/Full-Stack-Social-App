import React from "react";
import UnauthenticatedUserSidebar from "./UnauthenticatedUserSidebar";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/server/actions/user.action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LinkIcon, MapIcon, MapPinIcon } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "./ui/separator";

const Sidebar = async () => {
    const { isAuthenticated, userId } = await auth();
  const user = await currentUser();

  if (!userId) return <UnauthenticatedUserSidebar/>;

  const currentClerkUser = await getUserByClerkId(userId);
  if (!currentClerkUser) return null;


  return (
    <div className="sticky top-20">
      <Card>
        <CardHeader className="flex flex-col gap-y-1 justify-center items-center text-center">
            <Avatar className="mb-2">
              <AvatarImage src={currentClerkUser.image || "https://github.com/shadcn.png"} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <CardTitle className="text-lg font-semibold">{currentClerkUser?.username}</CardTitle>
            <CardDescription className="text-sm">{currentClerkUser?.name}</CardDescription>
        </CardHeader>

        <CardContent>
          <Separator className="my-4"/>
          <div className="flex justify-between">
            <div className="flex flex-col items-center justify-center">
                <p>{currentClerkUser._count.following}</p>
                <p className="text-xs text-muted-foreground">Following</p>
            </div>

            <div className="flex flex-col items-center justify-center">
                <p>{currentClerkUser._count.followers}</p>
                <p className="text-xs text-muted-foreground">Followers</p>
            </div>
          </div>
          <Separator className="my-4"/>
        </CardContent>

        <CardFooter className="flex flex-col items-start gap-y-2">
          <div className="flex">
            <MapPinIcon className="w-4 h-4 mr-2"  />
            <p className="text-sm text-muted-foreground">{currentClerkUser.location || "No Location"}</p>
          </div>

          <div className="flex">
            <LinkIcon className="w-4 h-4 mr-2" />
            <a className="text-sm text-muted-foreground hover:underline" target="_blank" href={currentClerkUser.website || ""}>{currentClerkUser.website || "No Website"}</a>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Sidebar;
