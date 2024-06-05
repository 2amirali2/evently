//@ts-nocheck
/* eslint-disable @next/next/no-img-element */
"use client"

import "react-datepicker/dist/react-datepicker.css"
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { eventFormValidation } from "@/lib/ValidationSchema"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import DropDown from "./DropDown"
import { Textarea } from "../ui/textarea"
import Image from "next/image"
import ReactDatePicker from "react-datepicker"
import { Checkbox } from "../ui/checkbox"
import { useState, useTransition } from "react"
import { createEvent, updateEvent } from "@/lib/actions/event.action"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { useEdgeStore } from "@/lib/edgestore"
import { eventDefaultValues } from "@/types"
import { SingleImageDropzone } from "./SingleImageDropzone"

interface EventFormProps {
  userId: string
  event?: {
    _id: string
    title: string
    description?: string
    location?: string
    createdAt: Date
    imageUrl: string
    startDateTime: Date
    endDateTime: Date
    price: string
    isFree: boolean
    url?: string
    category: { _id: string; name: string }
    organizer: { _id: string; familyName: string; givenName: string }
  }
  eventId?: string
  type: "Create" | "Update"
}

const EventForm = ({ type, userId, event, eventId }: EventFormProps) => {
  const [file, setFile] = useState<File>()
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const { edgestore } = useEdgeStore()

  const initialValues =
    event && type === "Update"
      ? {
          ...event,
          startDateTime: new Date(event.startDateTime),
          endDateTime: new Date(event.endDateTime),
        }
      : eventDefaultValues

  // 1. Define your form.
  const form = useForm<z.infer<typeof eventFormValidation>>({
    resolver: zodResolver(eventFormValidation),
    defaultValues: initialValues,
  })

  function onSubmit(values: z.infer<typeof eventFormValidation>) {
    console.log(values)
    startTransition(async () => {
      if (file) {
        const res = await edgestore.publicFiles.upload({ file })

        if (type === "Create") {
          try {
            await createEvent({
              event: { ...values, imageUrl: res.url },
              userId,
            })

            // if (newEvent) {
            form.reset()
            router.push("/")
            // }
          } catch (error) {
            console.log(error)
          }
        }

        if (type === "Update") {
          if (!eventId) {
            return
          }

          try {
            await updateEvent({
              event: { ...values, imageUrl: res.url, _id: eventId },
              eventId: eventId,
            })

            form.reset()
            router.push("/")
          } catch (error) {
            console.log(error)
          }
        }
      }
    })
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Title"
                    {...field}
                    className="input-field"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <DropDown
                    onChangeHandler={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl className="h-72">
                  <Textarea
                    placeholder="Description"
                    {...field}
                    className="textarea rounded-2xl"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem className="w-full bg-gray-50 rounded-2xl">
                <FormControl className="h-72 flex items-center justify-center">
                  <div>
                    <SingleImageDropzone
                      width={200}
                      height={200}
                      value={field.value ? field.value : file}
                      onChange={(file) => {
                        setFile(file)
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                    <Image
                      src={"/assets/icons/location-grey.svg"}
                      alt="calander"
                      width={24}
                      height={24}
                    />
                    <Input
                      placeholder="Event location or Online"
                      {...field}
                      className="input-field"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                    <Image
                      src={"/assets/icons/calendar.svg"}
                      alt="calander"
                      width={24}
                      height={24}
                    />
                    <ReactDatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeSelect
                      timeInputLabel="Time:"
                      dateFormat={"MM/dd/yyyy h:mm aa"}
                      wrapperClassName="datePicker"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                    <Image
                      src={"/assets/icons/calendar.svg"}
                      alt="calander"
                      width={24}
                      height={24}
                    />
                    <ReactDatePicker
                      selected={field.value}
                      onChange={(date: Date) => field.onChange(date)}
                      showTimeInput
                      timeInputLabel="Time:"
                      dateFormat={"MM/dd/yyyy h:mm aa"}
                      wrapperClassName="datePicker"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
                    <Image
                      src="/assets/icons/dollar.svg"
                      alt="dollar"
                      width={24}
                      height={24}
                      className="filter-grey"
                    />
                    <Input
                      type="number"
                      placeholder="Price"
                      {...field}
                      className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                    <FormField
                      control={form.control}
                      name="isFree"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex items-center">
                              <label
                                htmlFor="isFree"
                                className="whitespace-nowrap pr-3 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                Free Ticket
                              </label>
                              <Checkbox
                                onCheckedChange={field.onChange}
                                checked={field.value}
                                id="isFree"
                                className="mr-2 h-5 w-5 border-2 border-primary-500"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="flex-center h-[54px] w-full overflow-hidden rounded-full bg-gray-50 px-4 py-2">
                    <Image
                      src={"/assets/icons/link.svg"}
                      alt="calander"
                      width={24}
                      height={24}
                    />
                    <Input
                      {...field}
                      placeholder="URL"
                      className="input-field"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-500 rounded-2xl"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="animate-spin h-4 w-4 mr-1" />{" "}
              {type === "Update" ? "Updating Event" : "Creating Event"}
            </>
          ) : (
            `${type} Event`
          )}
        </Button>
      </form>
    </Form>
  )
}
export default EventForm
