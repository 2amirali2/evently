import EventForm from "@/components/shared/EventForm"
import { getEventById } from "@/lib/actions/event.action"
import { fetchUser } from "@/lib/actions/user.action"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

const EventDetailsPage = async ({ params }: { params: { id: string } }) => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if (!user) return null

  const userInfo = await fetchUser(user.id)

  const event = await getEventById(params.id)

  return (
    <>
      <section className="bg-gray-100/90 py-5 md:py-10">
        <h1 className="wrapper text-center text-3xl font-bold sm:text-left">
          Update Event
        </h1>
      </section>
      <div className="wrapper my-8">
        <EventForm
          type="Update"
          userId={userInfo._id.toString()}
          eventId={event._id}
          event={event}
        />
      </div>
    </>
  )
}
export default EventDetailsPage
