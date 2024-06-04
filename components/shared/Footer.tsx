import Image from "next/image"

const Footer = () => {
  return (
    <footer className="bg-white border-t px-5">
      <div className="flex flex-col gap-2 sm:flex-row justify-between items-center py-6 max-w-7xl mx-auto">
        <div className="">
          <Image
            src={"/assets/images/logo.svg"}
            alt="logo"
            width={130}
            height={140}
            className="object-contain"
          />
        </div>
        <div>
          <p>2024 Evently. All Rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
export default Footer
