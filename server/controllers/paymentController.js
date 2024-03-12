const Order = require('../models/orderModel')
const Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


const createCheckoutSession = async (req, res) => {
    const headersList = req.headers
    try {
        // const customer = await stripe.customers.create({
        //     metadata: {
        //         userId: req.body.userId,
        //         data: JSON.stringify(req.body.data.map(item => {
        //             return {
        //                 product: item._id,
        //                 qty: item.qty
        //             }
        //         })),
        //     }
        // })
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Pro Plan SELFManaged',
                        },
                        unit_amount: 500
                    },
                    quantity: 1
                }
            ],
            mode: 'payment',
            success_url: `${headersList.origin}/checkout-success`,
            cancel_url: `${headersList.origin}`,
        })
        res.json({
            sessionId: session.id
        })
    } catch (error) {
        console.log(error)
        res.json({
            error: "Error creating checkout session"
        })
    }
}


module.exports = {
    createCheckoutSession
}