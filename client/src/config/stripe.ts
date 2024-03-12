import { Stripe, loadStripe } from '@stripe/stripe-js'

let stripePromise: Promise<Stripe | null>

export const getStripe = () => {
    if(!stripePromise) {
        stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISH as string)
    }
    return stripePromise
}