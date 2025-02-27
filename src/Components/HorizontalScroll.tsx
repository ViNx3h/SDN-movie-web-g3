import { useRef } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import Card from './Card';



const HorizontalScroll = ({ data, heading, trending, media_type }: { data: any; heading: string; trending: boolean; media_type: string }) => {

    const containerRef = useRef<any>();
    const handleNext = async () => {
        containerRef.current.scrollLeft += 300
    }
    const handlePrev = async () => {
        containerRef.current.scrollLeft -= 300
    }

    return (
        <div className="container mx-auto px-3 my-10">
            <h2 className="text-xl lg:text-2xl font-bold mb-2 text-white">{heading}</h2>
            <div className="relative" >
                <div ref={containerRef} className="grid grid-cols-[repeat(auto-fit,228px)] grid-flow-col overflow-hidden  overflow-x-hidden relative gap-8 z-10 scroll-smooth transition-all">
                    {
                        data.map((item: any, index: number) => {
                            return (
                                <Card key={item.id + "heading" + index} data={item} index={index + 1} trending={trending} media_type={media_type} />
                            )
                        })
                    }

                </div>
                <div className='hidden absolute top-0 lg:flex justify-between w-full h-full items-center'>
                    <button onClick={handlePrev} className='bg-white p-1 text-black rounded-full ml-1 z-10'>
                        <FaAngleLeft />
                    </button>
                    <button onClick={handleNext} className='bg-white p-1 text-black rounded-full mr-1 z-10'>
                        <FaAngleRight />
                    </button>
                </div>

            </div>
        </div>
    );
};


export default HorizontalScroll