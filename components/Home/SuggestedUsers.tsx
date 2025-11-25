import { getRandomUsers } from '@/server/actions/user.action'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
// import { AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import FollowButton from './FollowButton';
import Link from 'next/link';

const SuggestedUsers = async () => {

  const randomUsers = await getRandomUsers();

  if (randomUsers.length === 0) return null;

  return (
    <div className='sticky top-20'>
      <Card>
        <CardHeader>
          <CardTitle>Suggested Users</CardTitle>
        </CardHeader>

        <CardContent className='flex flex-col gap-y-3'>
          {randomUsers.map((user, idx) => {
            return (
              <div className="flex justify-between items-center" key={idx}>
                <div className='flex gap-3 items-center'>
                  <Link href={`profile/${user.username || ""}`}>
                    <Avatar className="mb-2 size-10">
                      <AvatarImage src={user.image ||"https://github.com/shadcn.png"} className="rounded-full" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </Link>

                  <div>
                    <h3>{user.name}</h3>
                    <p className='text-muted-foreground text-xs'>@{user.username}</p>
                    <p className='text-muted-foreground text-xs'>{user._count.followers} followers</p>
                  </div>
                </div>

                <FollowButton userId={user.id}/>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}

export default SuggestedUsers