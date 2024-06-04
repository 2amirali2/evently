import CategoryFilter from "@/components/shared/CategoryFilter"
import Collection from "@/components/shared/Collection"
import Hero from "@/components/shared/Hero"
import Search from "@/components/shared/Search"
import { getAllEvents } from "@/lib/actions/event.action"
import { SearchParamProps } from "@/types"

export default async function Home({ searchParams }: SearchParamProps) {
  const page = Number(searchParams?.page) || 1
  const searchText = (searchParams?.query as string) || ""
  const category = (searchParams?.category as string) || ""

  const events = await getAllEvents({
    query: searchText,
    category,
    page,
    limit: 6,
  })

  return (
    <main>
      <Hero />

      <section className="pb-10" id="events">
        <div className="max-w-7xl mx-auto px-5 mt-16 flex flex-col gap-10 pb-5">
          <div>
            <h3 className="font-bold text-4xl">
              Trust by
              <br />
              Thousands of Events
            </h3>
          </div>
          <div className="flex w-full flex-col gap-5 md:flex-row">
            <Search />
            <CategoryFilter />
          </div>
          <Collection
            data={events?.data}
            emptyTitle="No Events Found"
            emptyStateSubtext="Come back later"
            collectionType="All_Events"
            limit={6}
            page={page}
            totalPages={events?.totalPages}
          />
        </div>
      </section>
    </main>
  )
}
