import Image from "next/image"
import { Button } from "../ui/button"
import Link from "next/link"

const Hero = () => {
  return (
    <section className="bg-gray-100/90">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 py-10 px-5">
        <div className="flex flex-col gap-7">
          <h1 className="font-extrabold text-4xl md:text-5xl lg:text-6xl">
            Host, Connect, Celebrate:Your Events, Our Platform!
          </h1>
          <p className="text-xl">
            Book and learn helpful tips from 3,168+ mentors in world-class
            companies with our global community.
          </p>
          <Button className="bg-blue-600 hover:bg-blue-500 rounded-3xl p-7 w-fit hover:shadow-2xl">
            <Link href={'#events'}>
            Explore Now
            </Link>
          </Button>
        </div>
        <div className="relative w-full h-[380px]">
          <Image
            src={"/assets/images/hero.png"}
            alt="Hero Image"
            objectFit="contain"
            fill
          />
        </div>
      </div>
    </section>
  )
}
export default Hero
