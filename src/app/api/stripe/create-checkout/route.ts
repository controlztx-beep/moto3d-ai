import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe, PLANS } from '@/lib/stripe/config'

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

export async function POST(request: NextRequest) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: 'Stripe is not configured. Please add STRIPE_SECRET_KEY to your environment variables.' },
        { status: 500 }
      )
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { plan } = body as { plan: string }

    if (!plan || (plan !== 'pro' && plan !== 'business')) {
      return NextResponse.json(
        { error: 'Invalid plan. Must be "pro" or "business"' },
        { status: 400 }
      )
    }

    const priceId = PLANS[plan as 'pro' | 'business'].priceId

    if (!priceId) {
      return NextResponse.json(
        { error: `Stripe price ID not configured for ${plan} plan. Please set STRIPE_${plan.toUpperCase()}_PRICE_ID in your environment variables.` },
        { status: 500 }
      )
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id
    const stripe = getStripe()

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      })
      customerId = customer.id

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${APP_URL}/dashboard/billing?success=true`,
      cancel_url: `${APP_URL}/dashboard/billing?canceled=true`,
      metadata: {
        userId: user.id,
        plan: plan,
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
