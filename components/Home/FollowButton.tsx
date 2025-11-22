"use client"

import { toggleFollow } from '@/server/actions/user.action'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { Button } from '../ui/button'
import { Loader2Icon } from 'lucide-react'

const FollowButton = ({userId}: {userId: string}) => {

    const [isLoading, setIsLoading] = useState(false)

    const handleToggleFollow = async () => {

        setIsLoading(true);

        try {   
            await toggleFollow(userId)
            toast.success('User followed successfully')

        } catch (error) {
            console.log('Error following the user', error)
            toast.error('Error following the user')

        } finally {
            setIsLoading(false)
        }

    }
    
    return (
        <Button onClick={handleToggleFollow}>
            {isLoading ? 
            <Loader2Icon className='animate-spin'/>
            :
            <p>Follow</p>}
        </Button>
    )
}

export default FollowButton