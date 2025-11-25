import { notFound } from "next/navigation";
import ProfilePageComponent from '@/components/profile/ProfilePageComponent';
import { getProfileByUsername, getUserLikedPosts, getUserPosts, isFollowing } from '@/server/actions/profile.action';

// Async server component — let Next.js infer everything
const Page = async ({ params }) => {
  const user = await getProfileByUsername(params.username);
  if (!user) return notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id),
  ]);

  return (
    <div>
      <ProfilePageComponent
        user={user}
        posts={posts}
        likedPosts={likedPosts}
        isFollowing={isCurrentUserFollowing}
      />
    </div>
  );
};

export default Page;
