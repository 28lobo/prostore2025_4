'use client'
import {useState, useTransition} from 'react';
import { toast } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogCancel, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { AlertDialogContent } from '@radix-ui/react-alert-dialog';


const DeleteDialog = ({id, action}: {
    id: string;
    action: (id:string) => Promise<{success: boolean; message: string}>;
}) => {
    const [open, setOpen] = useState(false);

    const [isPending, startTransition] = useTransition();

    const handleDeleteClick = () => {
        startTransition(async () => {
            const {success, message} = await action(id);
            if(success){
                toast.success(message);
                setOpen(false);
            }else{
                toast.error(message);
            }
        })
    }
    return ( <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
            <Button size="sm" variant="destructive" className="ml-2">
                Delete

            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                This action cannot be undone.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>
                    Cancel
                </AlertDialogCancel>
                <Button 
                variant="destructive"
                size="sm"
                disabled={isPending}
                onClick={handleDeleteClick}
                >
                    {isPending ? "Deleting..." : "Delete"}
                </Button>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog> );
}
 
export default DeleteDialog;