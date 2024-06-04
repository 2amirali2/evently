"use server"

import { revalidatePath } from "next/cache"
import { connectToDB } from "../db"
import Category from "../models/category.model"
import Event from "../models/event.model"
import User from "../models/user.model"

interface CreateEventProps {
  userId: string
  event: {
    title: string
    description: string
    location: string
    imageUrl: string
    startDateTime: Date
    endDateTime: Date
    categoryId: string
    price: string
    isFree: boolean
    url: string
  }
}

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: 'i' } })
}

export async function createEvent({ event, userId }: CreateEventProps) {
  try {
    await connectToDB()

    const organizer = await User.findById(userId)
    if (!organizer) throw new Error("No User found")

    {
      ;/ *const newEvent = * /
    }
    await Event.create({
      ...event,
      organizer: userId,
      category: event.categoryId,
    })

    revalidatePath("/events/create")

    // return JSON.parse(JSON.stringify(newEvent))
  } catch (error: any) {
    throw new Error(`Faild to create event: ${error.message}`)
  }
}

export async function getEventById(userId: string) {
  try {
    connectToDB()

    const event = await Event.findById(userId)
      .populate({
        path: "category",
        model: Category,
        select: "_id name",
      })
      .populate({
        path: "organizer",
        model: User,
        select: "_id givenName familyName",
      })

    revalidatePath(`/events/${event._id}`)

    return JSON.parse(JSON.stringify(event))
  } catch (error: any) {
    throw new Error(`Faild to fetch event: ${error.message}`)
  }
}

interface GetAllEventsParams {
  query: string
  limit: number
  page: string | number
  category: string
}

export async function getAllEvents({
  query,
  limit = 6,
  page,
  category,
}: GetAllEventsParams) {
  try {
    connectToDB()

    const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
    const categoryCondition = category ? await getCategoryByName(category) : null
    const conditions = {
      $and: [titleCondition, categoryCondition ? { category: categoryCondition._id } : {}],
    }

    const skipAmount = (Number(page) - 1) * limit

    const events = await Event.find(conditions)
      .populate({
        path: "category",
        model: Category,
        select: "_id name",
      })
      .populate({
        path: "organizer",
        model: User,
        select: "_id familyName givenName",
      })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit)

    const eventsCount = await Event.countDocuments(conditions)

    revalidatePath("/")
    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    }
  } catch (error: any) {
    throw new Error(`Faild to fetch all events: ${error.message}`)
  }
}

export async function deleteEvent(eventId: string) {
  try {
    connectToDB()

    await Event.findByIdAndDelete(eventId)

    revalidatePath("/")
  } catch (error: any) {
    throw new Error(`Faild to delete events: ${error.message}`)
  }
}

interface UpdateEventProps {
  eventId: string
  event: {
    _id: string
    title: string
    description: string
    location: string
    imageUrl: string
    startDateTime: Date
    endDateTime: Date
    categoryId: string
    price: string
    isFree: boolean
    url: string
  }
}

export async function updateEvent({ event, eventId }: UpdateEventProps) {
  try {
    connectToDB()

    const eventToUpdate = await Event.findById(event._id)
    if (!eventToUpdate) {
      throw new Error("event not found")
    }

    await Event.findByIdAndUpdate(
      eventId,
      {
        ...event,
        category: event.categoryId,
      },
      { new: true }
    )

    revalidatePath(`/events/${eventId}`)
  } catch (error: any) {
    throw new Error(`Faild to update events: ${error.message}`)
  }
}

interface GetRelatedEventsByCategoryProps {
  categoryId: string
  eventId: string
  limit?: number
  page: number | string
}

export async function getRelatedEventsByCategory({ categoryId, eventId, page = 1, limit = 3 }: GetRelatedEventsByCategoryProps) {
  try {
    connectToDB()

    const skipAmount = (Number(page) - 1) * limit
    const conditions = { $and: [ { category: categoryId }, { _id: { $ne: eventId } } ] }

    const events = await Event.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit)

    const eventsCount = await Event.countDocuments(conditions)

    revalidatePath(`/`)
    
    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    }
  } catch (error: any) {
    throw new Error(`Faild to fetch event by category: ${error.message}`)
  }
}