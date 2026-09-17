import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    // Read certificates data
    const dataPath = join(process.cwd(), "content", "certificates.json");
    const data = await readFile(dataPath, "utf-8");
    const certificates = JSON.parse(data);
    
    // Find certificate
    const cert = certificates.find((c: any) => c.id === id);
    
    if (!cert) {
      return new NextResponse("Certificate not found", { status: 404 });
    }

    // Return HTML page with certificate
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cert.title} - Certificate</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: #020817;
      color: #ffffff;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    
    .header {
      background: #0f172a;
      border-bottom: 1px solid #334155;
      padding: 1.5rem 2rem;
      position: sticky;
      top: 0;
      z-index: 10;
      backdrop-filter: blur(10px);
    }
    
    .header-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }
    
    .header h1 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #ffffff;
    }
    
    .header .issuer {
      font-size: 0.875rem;
      color: #60a5fa;
      margin-top: 0.25rem;
    }
    
    .close-btn {
      background: #1e293b;
      border: 1px solid #334155;
      color: #94a3b8;
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      cursor: pointer;
      font-size: 0.875rem;
      transition: all 0.2s;
    }
    
    .close-btn:hover {
      background: #334155;
      color: #ffffff;
    }
    
    .container {
      flex: 1;
      max-width: 1400px;
      margin: 0 auto;
      padding: 2rem;
      width: 100%;
    }
    
    .cert-image {
      background: #0f172a;
      border-radius: 1rem;
      overflow: hidden;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
      margin-bottom: 2rem;
    }
    
    .cert-image img {
      width: 100%;
      height: auto;
      display: block;
      user-select: none;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      pointer-events: none;
    }
    
    .details {
      background: #0f172a;
      border: 1px solid #334155;
      border-radius: 1rem;
      padding: 2rem;
      margin-bottom: 1rem;
    }
    
    .detail-item {
      margin-bottom: 1.5rem;
    }
    
    .detail-item:last-child {
      margin-bottom: 0;
    }
    
    .detail-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #64748b;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .detail-value {
      font-size: 1rem;
      color: #ffffff;
    }
    
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-left: 0.5rem;
    }
    
    .badge.active {
      background: rgba(34, 197, 94, 0.2);
      color: #4ade80;
    }
    
    .badge.expired {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
    }
    
    .warning {
      background: rgba(59, 130, 246, 0.1);
      border: 1px solid rgba(59, 130, 246, 0.3);
      border-radius: 0.75rem;
      padding: 1rem;
      display: flex;
      gap: 0.75rem;
      font-size: 0.875rem;
      color: #93c5fd;
    }
    
    .warning svg {
      flex-shrink: 0;
      width: 1.25rem;
      height: 1.25rem;
    }
    
    @media (max-width: 768px) {
      .header {
        padding: 1rem;
      }
      
      .header h1 {
        font-size: 1.125rem;
      }
      
      .container {
        padding: 1rem;
      }
      
      .details {
        padding: 1.5rem;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="header-content">
      <div>
        <h1>${cert.title}</h1>
        <div class="issuer">${cert.issuer}</div>
      </div>
      <button class="close-btn" onclick="window.close()">Close</button>
    </div>
  </div>
  
  <div class="container">
    <div class="cert-image">
      <img 
        src="${cert.image}" 
        alt="${cert.title}"
        oncontextmenu="return false;"
        draggable="false"
      />
    </div>
    
    <div class="details">
      <div class="detail-item">
        <div class="detail-label">Issued Date</div>
        <div class="detail-value">${cert.date}</div>
      </div>
      
      ${cert.expiryDate ? `
      <div class="detail-item">
        <div class="detail-label">Expiry Date</div>
        <div class="detail-value">
          ${cert.expiryDate}
          ${!cert.expiryDate || new Date(cert.expiryDate) > new Date() 
            ? '<span class="badge active">✓ Active</span>' 
            : '<span class="badge expired">✗ Expired</span>'}
        </div>
      </div>
      ` : ''}
      
      ${cert.description ? `
      <div class="detail-item">
        <div class="detail-label">Description</div>
        <div class="detail-value">${cert.description}</div>
      </div>
      ` : ''}
    </div>
    
    <div class="warning">
      <svg fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
      </svg>
      <p>This certificate is protected. Right-click and downloads are disabled to protect intellectual property rights.</p>
    </div>
  </div>
  
  <script>
    // Disable right-click
    document.addEventListener('contextmenu', e => e.preventDefault());
    
    // Disable keyboard shortcuts for download/save
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p')) {
        e.preventDefault();
      }
    });
  </script>
</body>
</html>
    `;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html",
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error loading certificate:", error);
    return new NextResponse("Error loading certificate", { status: 500 });
  }
}
