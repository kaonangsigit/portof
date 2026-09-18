import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Read from MongoDB (works on Vercel — no local filesystem)
    const db   = await getDb();
    const cert = await db.collection("certificates").findOne({ id: params.id });

    if (!cert) {
      return new NextResponse(
        `<!DOCTYPE html><html><body style="background:#020817;color:#fff;font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0">
          <div style="text-align:center"><h1 style="color:#f87171">Certificate Not Found</h1><p style="color:#64748b;margin-top:1rem">The certificate you are looking for does not exist.</p><a href="javascript:window.close()" style="display:inline-block;margin-top:1.5rem;padding:.5rem 1.5rem;background:#1e293b;color:#fff;border-radius:.5rem;text-decoration:none">Close</a></div>
        </body></html>`,
        { status: 404, headers: { "Content-Type": "text/html" } }
      );
    }

    const isActive = !cert.expiryDate || new Date(cert.expiryDate) > new Date();

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${cert.title} — Certificate</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif;background:#020817;color:#fff;min-height:100vh;display:flex;flex-direction:column}
    .header{background:#0f172a;border-bottom:1px solid #1e293b;padding:1.25rem 2rem;position:sticky;top:0;z-index:10;backdrop-filter:blur(10px)}
    .header-inner{max-width:1200px;margin:0 auto;display:flex;justify-content:space-between;align-items:center;gap:1rem}
    .header h1{font-size:1.25rem;font-weight:700;color:#fff}
    .header .issuer{font-size:.8rem;color:#60a5fa;margin-top:.2rem}
    .close-btn{background:#1e293b;border:1px solid #334155;color:#94a3b8;padding:.5rem 1.25rem;border-radius:.5rem;cursor:pointer;font-size:.875rem;transition:all .2s;text-decoration:none;display:inline-block}
    .close-btn:hover{background:#334155;color:#fff}
    .container{flex:1;max-width:1200px;margin:0 auto;padding:2rem;width:100%}
    .cert-img-wrap{background:#0f172a;border-radius:1rem;overflow:hidden;box-shadow:0 20px 25px -5px rgba(0,0,0,.4);margin-bottom:1.5rem;border:1px solid #1e293b}
    .cert-img-wrap img{width:100%;height:auto;display:block;pointer-events:none;user-select:none;-webkit-user-select:none}
    .details{background:#0f172a;border:1px solid #1e293b;border-radius:1rem;padding:1.5rem;margin-bottom:1rem;display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}
    .detail-label{font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;color:#475569;font-weight:600;margin-bottom:.25rem}
    .detail-value{font-size:.95rem;color:#e2e8f0}
    .badge{display:inline-flex;align-items:center;gap:.25rem;padding:.2rem .6rem;border-radius:9999px;font-size:.7rem;font-weight:600;margin-left:.5rem}
    .badge.active{background:rgba(34,197,94,.2);color:#4ade80}
    .badge.expired{background:rgba(239,68,68,.2);color:#f87171}
    .notice{background:rgba(59,130,246,.08);border:1px solid rgba(59,130,246,.25);border-radius:.75rem;padding:.875rem 1rem;font-size:.8rem;color:#93c5fd;display:flex;gap:.6rem;align-items:flex-start}
    @media(max-width:640px){.header{padding:1rem}.container{padding:1rem}.details{grid-template-columns:1fr}}
  </style>
</head>
<body>
  <div class="header">
    <div class="header-inner">
      <div>
        <h1>${cert.title}</h1>
        <div class="issuer">${cert.issuer}</div>
      </div>
      <a href="javascript:window.close()" class="close-btn">✕ Close</a>
    </div>
  </div>

  <div class="container">
    ${cert.image ? `
    <div class="cert-img-wrap">
      <img src="${cert.image}" alt="${cert.title}" oncontextmenu="return false" draggable="false" />
    </div>` : `
    <div style="background:#0f172a;border:1px solid #1e293b;border-radius:1rem;padding:3rem;text-align:center;margin-bottom:1.5rem">
      <div style="font-size:3rem;margin-bottom:1rem">🏆</div>
      <p style="color:#475569;font-size:.9rem">No image available for this certificate</p>
    </div>`}

    <div class="details">
      <div>
        <div class="detail-label">Title</div>
        <div class="detail-value">${cert.title}</div>
      </div>
      <div>
        <div class="detail-label">Issued By</div>
        <div class="detail-value" style="color:#60a5fa">${cert.issuer}</div>
      </div>
      <div>
        <div class="detail-label">Issue Date</div>
        <div class="detail-value">${cert.date}</div>
      </div>
      ${cert.expiryDate ? `
      <div>
        <div class="detail-label">Expiry Date</div>
        <div class="detail-value">
          ${cert.expiryDate}
          <span class="badge ${isActive ? "active" : "expired"}">${isActive ? "✓ Active" : "✗ Expired"}</span>
        </div>
      </div>` : `
      <div>
        <div class="detail-label">Status</div>
        <div class="detail-value"><span class="badge active">✓ Active</span></div>
      </div>`}
      ${cert.description ? `
      <div style="grid-column:1/-1">
        <div class="detail-label">Description</div>
        <div class="detail-value">${cert.description}</div>
      </div>` : ""}
    </div>

    <div class="notice">
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style="flex-shrink:0;margin-top:.1rem"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
      This certificate is protected. Downloading and right-clicking are disabled.
    </div>
  </div>

  <script>
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && ['s','p','u'].includes(e.key)) e.preventDefault();
    });
  </script>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    console.error("[view-page]", err);
    return new NextResponse("Error loading certificate", { status: 500 });
  }
}
