import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Loader2Icon, Trash2 } from "lucide-react"

import React from 'react'
import { Button } from "../ui/button"

interface DeleteAlertDialogTypes {
    isDeleting: boolean,
    onDelete: () => Promise<void>,
    title?: string,
    description?: string

}

const DeleteAlertDialog = ({isDeleting, onDelete, title='Delete Post', description='This action cannot be undone.'}: DeleteAlertDialogTypes) => {
  return (
    <div>
        <AlertDialog>
        <AlertDialogTrigger asChild>
            <Button variant={'ghost'} >

                {isDeleting ?
                <Loader2Icon className='animate-spin size-4'/>
                :
                <Trash2 className="size-4"/>
                }
            </Button>
        </AlertDialogTrigger>

        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
                {description}
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={onDelete} className="bg-red-500 hover:bg-red-600" disabled={isDeleting }>
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
        </AlertDialog>
    </div>
  )
}

export default DeleteAlertDialog