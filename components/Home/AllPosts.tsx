import React from 'react'
import PostCard from './PostCard';
import { getPosts } from '@/server/actions/post.action';
import { getDbUserId } from '@/server/actions/user.action';

const AllPosts = async () => {

  const posts = await getPosts();
  const currentUserDbId = await getDbUserId();

  return (
    <div>
      {posts.map((post) => {
        return <PostCard key={post.id} post={post} dbUserId={currentUserDbId}/>
      })}
    </div>
  )
}

export default AllPosts