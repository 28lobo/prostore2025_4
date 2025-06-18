import { Resend } from 'resend';
import { SENDER_EMAIL, APP_NAME } from '@/lib/constants';
import { Order } from '@/types';
import dotenv from 'dotenv';
dotenv.config();
import PurchaseReceiptEmail from './purchase-receipt';

// Create a new Resend instance that will be used to send emails
const resend = new Resend(process.env.RESEND_API_KEY as string);

// Function to send a purchase receipt email
export const sendPurchaseReceipt = async ({order}: { order: Order}) => {
    await resend.emails.send({
        from: `${APP_NAME} <${SENDER_EMAIL}>`,
        to: order.user.email,
        subject: `Order Confirmation - ${order.id}`,
        react: <PurchaseReceiptEmail order={order} />,
        text: 'Thank you for your order. We appreciate your business and look forward to serving you again soon.'
    })
}