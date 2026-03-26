import { ImageResponse } from '@vercel/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #0A0A0F 0%, #0d1117 50%, #1a1a2e 100%)',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
          <div style={{ fontSize: '64px' }}>🏍️</div>
          <div style={{ fontSize: '56px', fontWeight: 'bold', color: 'white' }}>
            MOTO3D <span style={{ color: '#0066FF' }}>AI</span>
          </div>
        </div>
        <div style={{ fontSize: '28px', color: '#9ca3af', textAlign: 'center', maxWidth: '600px' }}>
          AI-Powered 3D Motorcycle Configurator
        </div>
        <div style={{ display: 'flex', gap: '32px', marginTop: '40px' }}>
          <div style={{ padding: '12px 24px', background: '#0066FF', borderRadius: '8px', color: 'white', fontSize: '18px' }}>
            Real-time 3D
          </div>
          <div style={{ padding: '12px 24px', background: '#00FF88', borderRadius: '8px', color: '#000', fontSize: '18px' }}>
            AI-Powered
          </div>
          <div style={{ padding: '12px 24px', border: '1px solid #333', borderRadius: '8px', color: 'white', fontSize: '18px' }}>
            B2B SaaS
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
