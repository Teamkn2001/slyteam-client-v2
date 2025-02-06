import { useIntersectionObserver } from "../transitions/useIntersectionObserver";
import { Star } from "lucide-react";
import SpotlightCard from "./SpotlightCard";

export default function Services() {
  const services = [
    "Residential & Luxury Property Sales",
    "Commercial Real Estate Solutions",
    "Property Investment & Consultation",
    "Custom Home Development",
    "Property Management Services",
    "Sustainable & Smart Living Solutions",
    "Real Estate Investment & Market Analysis",
    "Financial Advisory & Mortgage Assistance",
  ];

  const [ref] = useIntersectionObserver({
    name: "card-group",
    threshold: 0.2,
    animateIn: "animate__fadeIn",
    animateOut: "animate__fadeOut",
  });

  return (
    <>
      <div className="w-full my-6 lg:bg-[#8F8061]/10" ref={ref}>
        <div className=" ml-8 p-4 lg:p-6 lg:pr-10 text-center lg:text-left ">
          <h1 className="text-xl lg:text-3xl font-bold">Our services</h1>
        </div>

        <div className="w-full lg:w-[93%] flex lg:flex-wrap overflow-y-scroll gap-2 lg:gap-6  lg:p-4 ml-2 scrollbar-hide">
          {services.map((service, index) => (
            <div className="hover:scale-105 duration-500" key={index}>
              <SpotlightCard className="lg:h-[12rem] flex flex-col gap-2 lg:gap-3 items-center justify-center">
                <h1 className="text-white flex gap-1 ">
                  <Star />
                  <Star />
                </h1>
                <h1 className="text-white font-bold text-md lg:text-lg">
                  {service}
                </h1>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
