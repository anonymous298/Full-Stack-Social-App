"use client"

import React, { useState } from "react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Textarea } from "../ui/textarea";
import { useUser } from "@clerk/nextjs";
import { Button } from "../ui/button";
import { ImageIcon, Loader2Icon, SendIcon } from "lucide-react";
import { Separator } from "../ui/separator";
import { createPost } from "@/server/actions/post.action";
import toast from "react-hot-toast";

const CreatePost = () => {

    const {user} = useUser()

    const [content, setContent] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const [imageUrl, setImageUrl] = useState("");
    const [showImageUpload, setShowImageUpload] = useState(false);

    const handleSubmit = async () => {
        
        if (!content.trim() && !imageUrl) return;

        setIsPosting(true)
        
        try {
            const result = await createPost(content, imageUrl);

            if (result?.success) {
                setContent("");
                setImageUrl("");
                setShowImageUpload(false);

                toast.success('Post created successfully')
            }



        } catch (error) {
            console.log('Not able to post this', error)
            toast.error("Error creating post")
        } finally {
            setIsPosting(false)
        }
    }

    const handleContentChange = (e) => setContent(e.target.value);

  return (
    <div>
      <Card>
        <CardContent className="flex gap-4">
            <Avatar className="mb-2 size-10">
                <AvatarImage src={user?.imageUrl ||"https://github.com/shadcn.png"} className="rounded-full" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <Textarea
                placeholder="What's on your mind?"
                className="min-h-[100px] resize-none border-none focus-visible:ring-0 p-0 text-muted-foreground"
                value={content}
                onChange={handleContentChange}
                disabled={isPosting}
            />

        </CardContent>

        <CardFooter className="p-3">
            <div className="flex justify-between items-center border-t-2 w-full p-3 pb-0">

                <Button variant={'ghost'} disabled={isPosting} onClick={() => setShowImageUpload(!showImageUpload)}>
                    <ImageIcon/>
                    <p className="text-muted-foreground">Photo</p>
                </Button>

                <Button onClick={handleSubmit} disabled={isPosting || (!content.trim() && !imageUrl)}>
                    {isPosting ?
                    <>
                        <Loader2Icon className="animate-spin"/>
                        <p>Posting...</p>
                    </>
                    :
                    <>
                        <SendIcon/>
                        <p className="">Post</p>
                    </>}
                    
                </Button>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreatePost;
