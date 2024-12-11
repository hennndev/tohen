const Order = require('../models/orderModel')
const Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)


const createCheckoutSession = async (req, res) => {
    const headersList = req.headers
    try {
        const customer = await stripe.customers.create({
            metadata: {
                userId: req.body.userId,
                data: JSON.stringify(req.body.products.map(item => {
                    return {
                        product: item._id,
                        qty: item.qty
                    }
                })),
            }
        })
        const line_items = req.body.products.map(item => {
            return {
                price_data: {
                    currency: 'USD',
                    product_data: {
                        name: item.name,
                        images: [item.image],
                        metadata: {
                            id: item._id
                        },
                    },
                    unit_amount: item.unit_amount
                },
                quantity: item.qty
            }
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            customer: customer.id,
            phone_number_collection: {
                enabled: true
            },
            custom_fields: [
                {
                    key: 'full_address',
                    label: {type: 'custom', custom: 'Full Address'},
                    type: 'text',
                }
            ],
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