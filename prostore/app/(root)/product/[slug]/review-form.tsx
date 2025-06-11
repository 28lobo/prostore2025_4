'use client'

import { useState } from "react"
import { toast } from "@/components/ui/sonner"
import { SubmitHandler, useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { insertReviewSchema } from "@/lib/validators"
import { reviewFormDefaultValues } from "@/lib/constants"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { StarIcon } from "lucide-react"
import { createUpdateReview, getMyReviewByProductId } from "@/lib/actions/review.actions"


const ReviewForm = ({
  userId,
  productId,
  onReviewSubmitted
}: {
  userId: string
  productId: string
  onReviewSubmitted: () => void
}) => {
  const [open, setOpen] = useState(false)

  const form = useForm<z.infer<typeof insertReviewSchema>>({
    resolver: zodResolver(insertReviewSchema),
    defaultValues: reviewFormDefaultValues
  })

  // open form handler
  const handleOpenForm = async () => {
    form.setValue('productId', productId)
    form.setValue('userId', userId)
    const review = await getMyReviewByProductId({ productId, userId })
    if(review) {
      form.setValue('title', review.Title)
      form.setValue('description', review.description)
      form.setValue('rating', review.rating)
    }
    setOpen(true)
  }
  
  // submit form handler
  const onSubmit:SubmitHandler<z.infer<typeof insertReviewSchema>> = async (values) => {
    const res = await createUpdateReview({...values, productId});
    if (res.success) {
      toast.success(res.message)
      setOpen(false)
      form.reset()
      onReviewSubmitted()
    } else {
      toast.error(res.message)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={handleOpenForm} variant="default">
        Write a review
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Write a review</DialogTitle>
              <DialogDescription>
                Share your thoughts with other customers
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Enter description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value.toString()}>
                        <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a rating"/>
                            </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {Array.from({length: 5}).map((_, index) =>(
                                <SelectItem key={index} value={(index + 1).toString()}>
                                    {index + 1} <StarIcon className="inline h-4 w-4 text-yellow-500"/>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
                <Button type="submit" size='lg' className="w-full" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? 'Submitting...' : 'Submit'}
                </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ReviewForm
