"use client";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import LogOutButton from "./LogOutButton";

const navigation = [
  { id: 1, title: "Home", path: "/" },
  { id: 2, title: "Create group", path: "/create-group" },
  { id: 3, title: "Update group", path: "/update-group" },
  { id: 4, title: "History", path: "/sending-history" },
  { id: 5, title: "Dashboard", path: "/dashboard" },
];

const Nav = () => {
  const { data: session, status } = useSession();
  console.log("sessionUserNav", session);
  console.log("statusNav", status);
  return (
    <>
      {" "}
      <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="flex flex-wrap items-center justify-between max-w-screen-xl p-4 mx-auto">
          <Link href="/" className="flex items-center">
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              NextAuthApp
            </span>
          </Link>
          {status === "authenticated" ? (
              <LogOutButton/>
          ) : (
            <>
              <div className="flex items-center">
                <Link
                  href="/signup"
                  className="mr-6 text-sm text-gray-500 dark:text-white hover:underline"
                >
                  Register
                </Link>
                <Link
                  href="/api/auth/signin"
                  className="text-sm text-blue-600 dark:text-blue-500 hover:underline"
                >
                  Login
                </Link>
              </div>
            </>
          )}
        </div>
      </nav>
      <nav className="grid grid-cols-3">
        <div>Sendler Logo</div>
        <div className="grid grid-cols-5 gap-6">
          {navigation.map(({ id, title, path }) => (
            <Link key={id} href={path}>
              {title}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Nav;
