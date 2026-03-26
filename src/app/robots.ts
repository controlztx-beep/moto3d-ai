import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { 
      userAgent: '*', 
      allow: '/', 
      disallow: ['/dashboard/', '/configurator/', '/api/'] 
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || 'https://moto3d.vercel.app'}/sitemap.xml` 
  }
}
