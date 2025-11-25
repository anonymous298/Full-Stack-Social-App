// "use client"

import AllPosts from "@/components/Home/AllPosts";
import SuggestedUsers from "@/components/Home/SuggestedUsers";
import { currentUser } from "@clerk/nextjs/server";
import CreatePost from "@/components/Home/CreatePost";
import UnauthenticatedUserSidebar from "@/components/UnauthenticatedUserSidebar";


export default async function Home() {
  const user = await currentUser();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
      <div className="lg:col-span-6">
        {user ? 
        <>
          <CreatePost/>
          <AllPosts/>
        </>
        :
        <UnauthenticatedUserSidebar/>}

      </div>

      <div className="hidden lg:block lg:col-span-4">
        <SuggestedUsers/>
      </div>
    </div>
  );
}
