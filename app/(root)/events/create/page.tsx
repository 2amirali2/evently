import EventForm from "@/components/shared/EventForm"
import { fetchUser } from "@/lib/actions/user.action"
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server"

const CreateEventPage = async () => {
  const { getUser } = getKindeServerSession()
  const user = await getUser()
  if(!user) return null;

  const userInfo = await fetchUser(user.id)
  console.log(userInfo._id.toString())
  
  return (
    <>
      <section className="bg-gray-100/90 py-5 md:py-10">
        <h1 className="wrapper text-center text-3xl font-bold sm:text-left">
          Create Event
        </h1>
      </section>
      <div className="wrapper my-8">
        <EventForm type="Create" userId={userInfo._id} />
      </div>
    </>
  )
}
export default CreateEventPage
