import ProfilePageComponent from '@/components/profile/ProfilePageComponent';
import { getProfileByUsername, getUserLikedPosts, getUserPosts, isFollowing } from '@/server/actions/profile.action'
import { notFound, useParams } from 'next/navigation'
import React from 'react'

export async function generateMetadata({params}: {params: {username : string}}) {
  const user = await getProfileByUsername(params.username);
  if (!user) return;

  return {
    title : `${user.name ?? user.username}`,
    description : user.bio || `Check out ${user.username}'s profile.`
  }
}

const Page = async ({params}: {params: {username : string}}) => {

  const user = await getProfileByUsername(params.username);
  if (!user) return notFound();

  const [posts, likedPosts, isCurrentUserFollowing] = await Promise.all([
    getUserPosts(user.id),
    getUserLikedPosts(user.id),
    isFollowing(user.id)
  ])

  return (
    <div>
        <ProfilePageComponent
          user={user}
          posts={posts}
          likedPosts={likedPosts}
          isFollowing={isCurrentUserFollowing}
        />
    </div>
  )

}

export default Page