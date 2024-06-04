"use client"

import Image from "next/image"
import { Button } from "../ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs"
import { useKindeBrowserClient } from "@kinde-oss/kinde-auth-nextjs"
import { Skeleton } from "../ui/skeleton"

const Header = () => {
  const { user, isLoading } = useKindeBrowserClient()

  const links = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Create Event",
      href: "/events/create",
    },
    // {
    //   label: "My Profile",
    //   href: "/profile",
    // },
  ]

  const pathname = usePathname()
  return (
    <header className="bg-white shadow-md px-5">
      <div className="flex justify-between items-center py-4 max-w-7xl mx-auto">
        <div className="">
          <Link href={"/"}>
            <Image
              src={"/assets/images/logo.svg"}
              alt="logo"
              width={130}
              height={140}
              className="object-contain"
            />
          </Link>
        </div>

        {user && (
          <div className="hidden md:flex gap-14">
            {links.map((link) => {
              return (
                <Link
                  href={link.href}
                  key={link.href}
                  className={cn("font-semibold text-sm", {
                    "text-blue-600": pathname === link.href,
                  })}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        )}

        {/* Logout and Userbutton functionality */}
        <div className="flex items-center gap-2">
          {isLoading ? (
            <Skeleton className="w-[110px] h-[40px] rounded-3xl bg-gray-300" />
          ) : (
            <Button className="bg-blue-600 hover:bg-blue-700 rounded-3xl px-8 py-4">
              {user ? (
                <LogoutLink>Logout</LogoutLink>
              ) : (
                <LoginLink>Login</LoginLink>
              )}
            </Button>
          )}

          {user && (
            <div className="flex md:hidden">
              <Sheet>
                <SheetTrigger>
                  <Image
                    src={"/assets/icons/menu.svg"}
                    alt="menu"
                    width={25}
                    height={25}
                    className="object-contain"
                  />
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle className="pb-5 border-b mb-7">
                      <Image
                        src={"/assets/images/logo.svg"}
                        alt="logo"
                        width={130}
                        height={140}
                        className="object-contain"
                      />
                    </SheetTitle>
                    <SheetDescription className="flex flex-col gap-2">
                      {links.map((link) => {
                        return (
                          <Link
                            href={link.href}
                            key={link.href}
                            className={cn("font-semibold text-sm", {
                              "text-blue-600": pathname === link.href,
                            })}
                          >
                            <SheetClose>{link.label}</SheetClose>
                          </Link>
                        )
                      })}
                    </SheetDescription>
                  </SheetHeader>
                </SheetContent>
              </Sheet>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
export default Header
