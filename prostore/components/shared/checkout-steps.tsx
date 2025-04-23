import React from "react";
import { cn } from "@/lib/utils";

const CheckoutSteps = ({ current = 0 }) => {
    return (
        // Removed space-y-2, added items-center and md:flex-nowrap
        <div className="flex flex-col md:flex-row md:flex-nowrap items-center justify-start md:justify-between space-x-0 md:space-x-2 space-y-2 md:space-y-0 mb-10 w-full">
            {["User Login", "Shipping Address", "Payment Method", "Place Order"].map((step, index) => (
                <React.Fragment key={step}>
                    {/* Consider reducing w-56 if space is tight */}
                    <div className={cn(
                        'p-2 w-56 rounded-full text-center text-sm shrink-0', // Added shrink-0 to prevent step text shrinking if space is extremely tight
                        index === current ? 'bg-secondary font-semibold' : 'bg-gray-100 text-gray-500' // Added example inactive state
                    )}>
                        {step}
                    </div>
                    {/* Use flex-grow for the line on medium screens? Or keep fixed width */}
                    {step !== "Place Order" && (
                        // Hide hr on small screens, show on md.
                        // md:flex-1 will make lines fill space if needed, or keep w-16 if fixed width is desired
                        <hr className="w-full md:w-16 lg:flex-1 border-t border-gray-300 my-2 md:my-0 md:mx-2" />
                        // <hr className="w-16 border-t border-gray-300 mx-2 hidden md:block" /> // Alternative: just hide on mobile
                    )}
                </React.Fragment>
            ))}
        </div>
    );
}

export default CheckoutSteps;