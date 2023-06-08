import { Fragment } from "react";
import Image from "next/image";
import { MagnifyingGlassIcon, UserCircleIcon } from "@heroicons/react/24/solid";
import { signIn, signOut, useSession } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";

const Header: React.FC = () => {
  return (
    <header className="flex flex-col items-center rounded-b-2xl bg-gray-500/10 p-5 md:flex-row">
      <Image
        src="https://links.papareact.com/c2cdd5"
        alt="Trello Logo"
        width={300}
        height={100}
        className="w-44 object-contain pb-10 md:w-56 md:pb-0"
      />
      <div className="flex w-full flex-1 items-center justify-end space-x-5">
        <form className="flex flex-1 items-center space-x-2 rounded-md bg-white px-4 py-2 shadow-md md:flex-initial">
          <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full flex-1 border-none p-2 font-normal text-gray-500 outline-none focus:border-none focus:ring-0"
          />
          <button type="submit" hidden>
            Search
          </button>
        </form>

        <Auth />
      </div>
    </header>
  );
};

const Auth: React.FC = () => {
  const { data: sessionData } = useSession();

  if (!sessionData)
    return (
      <button
        className="font-normal text-gray-500 transition hover:text-gray-900"
        onClick={() => void signIn()}
      >
        Sign in
      </button>
    );

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="rounded-full">
          {sessionData.user.image ? (
            <Image
              src={sessionData.user.image}
              width={50}
              height={50}
              alt="User Avatar"
              className="h-14 w-14 rounded-full object-cover object-center"
            />
          ) : (
            <UserCircleIcon className=" h-14 w-14 rounded-full object-cover object-center text-gray-500" />
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-md">
          <div className="py-3">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="#"
                  className={`
                    ${active ? "bg-gray-400/10 text-gray-900" : "text-gray-500"}
                    block w-full px-4 py-2 text-left`}
                >
                  Account
                </a>
              )}
            </Menu.Item>

            <Menu.Item>
              {({ active }) => (
                <button
                  className={`
                    ${active ? "bg-gray-400/10 text-gray-900" : "text-gray-500"}
                    block w-full px-4 py-2 text-left`}
                  onClick={() => void signOut()}
                >
                  Sign out
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Header;
