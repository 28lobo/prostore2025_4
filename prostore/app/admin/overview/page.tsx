import { auth } from "@/auth";
import { getOrderSummary } from "@/lib/actions/order.actions";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Admin Overview',
    description: 'Overview of the admin panel',
}


const AdminOverviewPage = async () => {
    const session = await auth();
    console.log("SESSION:", session);
    if(session?.user.role !== "admin"){
        throw new Error("User is not authorized to view this page");
    };

    const summary = await getOrderSummary();
    console.log(summary);
    return ( <>Overview</> );
}
 
export default AdminOverviewPage;