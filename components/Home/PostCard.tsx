"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { AvatarFallback, Avatar, AvatarImage } from '../ui/avatar'
import { Delete, DeleteIcon, Heart, Loader2Icon, MessageCircleIcon, SendIcon, Trash, Trash2Icon } from 'lucide-react'
import { Post } from '@/app/generated/prisma/client'
import { useUser } from '@clerk/nextjs'
import { createComment, deletePost, getPosts, toggleLike } from '@/server/actions/post.action'
import toast from 'react-hot-toast'
import {formatDistanceToNow} from 'date-fns'
import DeleteAlertDialog from './DeleteAlertDialog'
import Image from 'next/image'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Textarea } from '../ui/textarea'
import Link from 'next/link'

type Posts = Awaited<ReturnType<typeof getPosts>>
type Post = Posts[number]

const PostCard = ({post, dbUserId}: {post: Post, dbUserId: string | null}) => {

    const {user} = useUser();
    const [newComment, setNewComment] = useState('');
    const [showComments, setShowComments] = useState(false);
    const [hasLiked, setHasLiked] = useState(post.likes.some(like => like.userId === dbUserId));
    const [hasCommented, setHasCommented] = useState(false);
    const [isLiking, setIsLiking] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [optimisticLikes, setOptimisticLikes] = useState(post._count.likes);

    const handleLike = async () => {
        if (isLiking) return;

        try {
            setIsLiking(true);
            setHasLiked(prev => !prev);
            setOptimisticLikes(prev => prev + (hasLiked ? -1 : 1));
            
            const result = await toggleLike(post.id)

            if (result?.success) {
                toast.success(hasLiked ? 'Unliked' : 'Liked')
            }

            else {
                toast.error('Post not liked')
            }

        } catch (error) {
            setOptimisticLikes(post._count.likes)
            setHasLiked(post.likes.some(like => like.userId === dbUserId))
            console.log('Error likeing the post', error)
        } finally {
            setIsLiking(false);
        }
    };

    const handleAddComment = async () => {

        setHasCommented(true);

        try {
            const result = await createComment(newComment, post.id)

            if (result) {
                setNewComment('');
                toast.success('Comment created successfully');
            } else {
                toast.error('Comment not created')
            }


        } catch (error) {
            console.log('Error creating the comment', error);
            toast.error('Error creating the comment')
        } finally {
            setHasCommented(false)
        }
    };

    const handleDelete = async () => {

        setIsDeleting(true)

        try {
            const result = await deletePost(post.id)

            if (result) {
                toast.success('Post Deleted...')
            } else {
                toast.error('Error deleting the post')
            }

        } catch (error) {
            console.log("Error deleting the post", error)
        } finally {
            setIsDeleting(false)
        }
    };

  return (
    <div className='my-5'>
        <Card>
            <CardHeader className='flex justify-between items-center'>
                <div className='flex gap-3 '>
                    <Link href={`profile/${post.author.username || ""}`}>
                        <Avatar className="mb-2 size-10">
                            <AvatarImage src={post.author.image ||"https://github.com/shadcn.png"} className="rounded-full" />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </Link>

                    <div className='flex flex-col gap-3'>
                        <div id="postInfo" className='flex gap-2'>
                            <h3>{post.author.name}</h3>
                            <p className='text-muted-foreground text-sm'>@{post.author.username}</p>
                            <p className='text-muted-foreground text-sm'>{formatDistanceToNow(new Date(post.createdAt))}</p>
                        </div>

                        <div id="posttitle" className=''>
                            <p className=''>{post.content}</p>
                        </div>
                    </div>
                </div>

                {/* delete post button */}
                <div className='self-start cursor-pointer'>

                    {user?.id === post.author.clerkId && ( 
                        <DeleteAlertDialog isDeleting={isDeleting} onDelete={handleDelete}/>
                    )}
                        
                </div>
            </CardHeader>

            <CardContent className='w-full relative '>
                {/* <Image src={post.author.image} alt='Post content' fill={true} /> */}
                <img src="https://github.com/shadcn.png" alt="img" className='w-full rounded-2xl' />
            </CardContent>

            <CardFooter className='flex flex-col items-start gap-y-3'>
                <div className='flex gap-3 border-b w-full'>
                    <Button className='flex gap-2' variant={'ghost'} onClick={handleLike}>
                        
                        <div >
                            {hasLiked ?
                            <Heart className='fill-red-500' />
                            :
                            <Heart />
                            }
                        </div>

                        {optimisticLikes}
                    </Button>

                    <Button variant={'ghost'} className='mb-4' onClick={() => setShowComments(prev => !prev)}>
                        <MessageCircleIcon className={`${showComments ? 'fill-blue-500': ''}`}/>

                        {post.comments.length}
                    </Button>

                </div>

                <div className={`${showComments ? '' : 'hidden'} w-full`}>
                    {post.comments.map((comment) => {
                        return (
                            <div key={comment.id} className='flex gap-2 overflow-x-hidden items-center mb-5'>
                                <Avatar className="mb-2 size-7">
                                    <AvatarImage src={comment.author.image ||"https://github.com/shadcn.png"} className="rounded-full" />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>

                                <div className='flex flex-col gap-1'>
                                    <div id="postInfo" className='flex gap-2 items-center'>
                                        <h3 className='text-sm'>{comment.author.name}</h3>
                                        <p className='text-muted-foreground text-xs'>@{comment.author.username}</p>
                                        <p className='text-muted-foreground text-xs'>{formatDistanceToNow(new Date(comment.createdAt))}</p>
                                    </div>

                                    <div id="posttitle" className=''>
                                        <p className=' text-ellipsis text-nowrap text-sm'>{comment.content}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}

                    <div className='w-full flex flex-col gap-2'>

                        <div className='flex gap-2 w-full'>
                            <Avatar className="mb-2 size-7">
                                <AvatarImage src={user?.imageUrl ||"https://github.com/shadcn.png"} className="rounded-full" />
                                <AvatarFallback>CN</AvatarFallback>
                            </Avatar>
                
                            <Textarea
                                placeholder="Write a comment..."
                                className="min-h-[70px] w-full resize-none border focus-visible:ring-0 p-2 placeholder:text-gray-500  text-primary text-xs"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                disabled={hasCommented}
                            />
                        </div>

                        <Button onClick={handleAddComment} disabled={hasCommented || !newComment.trim()} className='self-end'>
                            {hasCommented ?
                            <>
                                <Loader2Icon className="animate-spin"/>
                                <p>Commenting...</p>
                            </>
                            :
                            <>
                                <SendIcon/>
                                <p className="">Comment</p>
                            </>}
                            
                        </Button>
                    </div>               
                </div>

            </CardFooter>
        </Card>
    </div>
  )
}

export default PostCard