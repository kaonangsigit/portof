import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Kaonang Sigit Prakoso — QA Engineer & Backend Developer';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 128,
          background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #0f172a 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 72, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' }}>
          Kaonang Sigit Prakoso
        </div>
        <div style={{ fontSize: 48, color: '#3b82f6', fontWeight: '600', marginBottom: 30, textAlign: 'center' }}>
          QA Engineer & Backend Developer
        </div>
        <div
          style={{
            fontSize: 32,
            color: '#f59e0b',
            marginBottom: 20,
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}
        >
          <span>✓ 200+ Docs Validated</span>
          <span>•</span>
          <span>✓ 1000+ Data Analyzed</span>
          <span>•</span>
          <span>✓ 50+ APIs Tested</span>
        </div>
        <div style={{ fontSize: 24, opacity: 0.7, marginTop: 20, textAlign: 'center' }}>
          Node.js • Python • Laravel • GCP • Testing & QA
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
