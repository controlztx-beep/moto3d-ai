import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    const secretKey = process.env.STRIPE_SECRET_KEY
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY is not configured')
    }
    stripeInstance = new Stripe(secretKey, {
      apiVersion: '2026-02-25.clover',
      typescript: true,
    })
  }
  return stripeInstance
}

export const PLANS = {
  free: {
    name: 'Starter',
    price: 0,
    priceId: null,
    features: [
      '1 motorcycle model',
      '100 views/month',
      'Basic AI chat',
      'MOTO3D watermark',
    ],
    limits: {
      models: 1,
      views: 100,
    },
  },
  pro: {
    name: 'Professional',
    price: 2900,
    priceId: process.env.STRIPE_PRO_PRICE_ID || null,
    features: [
      '10 motorcycle models',
      '10,000 views/month',
      'Full AI features',
      'No watermark',
      'Custom branding',
      'Basic analytics',
    ],
    limits: {
      models: 10,
      views: 10000,
    },
  },
  business: {
    name: 'Business',
    price: 7900,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID || null,
    features: [
      'Unlimited models',
      'Unlimited views',
      'Full AI + API',
      'White-label',
      'Advanced analytics',
      'Team management',
    ],
    limits: {
      models: -1,
      views: -1,
    },
  },
} as const

export type PlanType = keyof typeof PLANS
