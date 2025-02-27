import { BiSolidMoviePlay } from "react-icons/bi"
import { MdHomeFilled } from "react-icons/md"
import { PiTelevisionFill } from "react-icons/pi"

const MobileNavigation = () => {
    return (
        <section className="lg:hidden h-16 bg-black bg-opacity-40 fixed bottom-0 w-full text-neutral-300 z-30">
            <div className="items-center flex justify-between h-full ">
                <a href="/tv" className="px-3 flex h-full items-center flex-col justify-center hover:text-neutral-100"><PiTelevisionFill className="text-2xl" />TV Shows</a>
                <a href="/movie" className="px-3 flex h-full items-center flex-col justify-center hover:text-neutral-100"><BiSolidMoviePlay className="text-2xl" />Movies</a>
                <a href="/" className="px-3 flex h-full items-center flex-col justify-center hover:text-neutral-100"><MdHomeFilled className="text-2xl" />Home</a>
            </div>
        </section>
    )
}

export default MobileNavigation