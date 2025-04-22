import CartTable from './cart-table'
import { getMyCart } from '@/lib/actions/cart.actions';


export const metadata = {
    title: 'Shopping Cart',
    keywords: 'cart, shopping cart, ecommerce, online store',
    description: 'Cart Page',
}

const CartPage = async () => {
    // Fetch the cart data from the server
    const cart = await getMyCart()
    // Check if the cart is empty or undefined
    const safeCart = cart ? { ...cart, sessionCartId: cart.sessionCartId || '' } : undefined;
    return ( <>
        <CartTable cart={safeCart} />
    </> );
}
 
export default CartPage;