import { fetchUser } from "@/lib/actions/user.action"
import { formatDateTime } from "@/lib/utils"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"
import Image from "next/image"
import Link from "next/link"
import { DeleteConfirmation } from "./DeleteConfirmation"

interface Props {
  event: {
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
  hasOrderLink?: boolean
  hidePrice?: boolean
}

const Card = async ({ event, hasOrderLink, hidePrice }: Props) => {
    const   { getUser } = getKindeServerSession()
    const user = await getUser()

    if(!user) return null;

    const dbUser = await fetchUser(user.id)
    if(!dbUser) return;
    
    const isEventCreator = user.id === dbUser.id

  return (
    <div className="group relative flex min-h-[380px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg md:min-h-[438px]">
      <Link 
        href={`/events/${event._id}`}
        style={{backgroundImage: `url(${event.imageUrl})`}}
        className="flex-center flex-grow bg-gray-50 bg-cover bg-center text-grey-500"
      />
      {/* IS EVENT CREATOR ... */}

      {isEventCreator && !hidePrice && (
        <div className="absolute right-2 top-2 flex flex-col gap-4 rounded-xl bg-white p-3 shadow-sm transition-all">
          <Link href={`/events/${event._id}/update`}>
            <Image src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
          </Link>

          <DeleteConfirmation eventId={event._id} />
        </div>
      )}

      <div
        className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4"
      > 
       {!hidePrice && <div className="flex gap-2">
          <span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-600">
            {event.isFree ? 'FREE' : `$${event.price}`}
          </span>
          <p className="p-semibold-14 w-min rounded-full bg-gray-500/10 px-4 py-1 text-gray-500 line-clamp-1">
            {event.category.name}
          </p>
        </div>}

        <p className="p-medium-16 p-medium-18 text-gray-500">
          {formatDateTime(event.startDateTime).dateTime}
        </p>

        <Link href={`/events/${event._id}`}>
          <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">{event.title}</p>
        </Link>

        <div className="flex-between w-full">
          <p className="p-medium-14 md:p-medium-16 text-gray-600">
            {event.organizer.givenName} {event.organizer.familyName}
          </p>

          {hasOrderLink && (
            <Link href={`/orders?eventId=${event._id}`} className="flex gap-2">
              <p className="text-blue-500">Order Details</p>
              <Image src="/assets/icons/arrow.svg" alt="search" width={10} height={10} />
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
export default Card