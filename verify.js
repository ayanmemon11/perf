/**
 * ==============================================================================
 * CERTIFICATE VERIFICATION SCRIPT - PERFECT COMPUTER EDUCATION
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('verify-form');
  const input = document.getElementById('cert-input');
  const resultBox = document.getElementById('verify-result');
  const submitBtn = document.getElementById('verify-submit-btn');

  // Check URL query param ?certNo=
  const urlParams = new URLSearchParams(window.location.search);
  const certParam = urlParams.get('certNo');
  if (certParam) {
    input.value = certParam;
    verifyCertificate(certParam);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const certNo = input.value.trim();
    if (!certNo) return;
    verifyCertificate(certNo);
  });

  async function verifyCertificate(certNo) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Verifying...`;
    resultBox.style.display = 'none';

    try {
      const res = await fetch(`/api/public/verify-certificate?certNo=${encodeURIComponent(certNo)}`);
      const data = await res.json();

      resultBox.style.display = 'block';

      if (data.success && data.found) {
        const c = data.certificate;
        resultBox.className = 'result-card success';
        resultBox.innerHTML = `
          <div class="cert-status-badge success">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            Certificate Verified Successfully
          </div>

          <div style="font-size: 1.15rem; font-weight: 800; color: var(--text-main); margin-bottom: 6px;">
            ${c.studentName}
          </div>
          <div style="font-size: 0.95rem; color: var(--primary); font-weight: 700; margin-bottom: 18px;">
            Course: ${c.course}
          </div>

          <div class="cert-grid">
            <div>
              <div class="cert-field-label">Certificate Number</div>
              <div class="cert-field-val">${c.certificateNo}</div>
            </div>
            <div>
              <div class="cert-field-label">Grade / Performance</div>
              <div class="cert-field-val">${c.grade || 'Passed / Certified'}</div>
            </div>
            <div>
              <div class="cert-field-label">Course Completion Date</div>
              <div class="cert-field-val">${c.completionDate || 'N/A'}</div>
            </div>
            <div>
              <div class="cert-field-label">Issue Date</div>
              <div class="cert-field-val">${c.issueDate || 'N/A'}</div>
            </div>
          </div>

          <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid rgba(22, 163, 74, 0.2); display: flex; align-items: center; justify-content: space-between;">
            <div style="font-size: 0.85rem; color: #166534;">
              <strong>Authorized Authority:</strong> ${c.authorizedSignatory || 'Perfect Computer Education'}
            </div>
            <a href="print-certificate.html?certNo=${encodeURIComponent(c.certificateNo)}" target="_blank" class="btn btn-outline btn-sm" style="font-size: 0.82rem; padding: 6px 14px;">
              View / Print Certificate
            </a>
          </div>
        `;
      } else {
        resultBox.className = 'result-card not-found';
        resultBox.innerHTML = `
          <div class="cert-status-badge not-found">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
            Verification Not Found
          </div>
          <p style="color: #991B1B; font-size: 0.95rem; margin-bottom: 8px;">
            ${data.message || 'No certificate record found matching this Certificate Number.'}
          </p>
          <p style="font-size: 0.85rem; color: var(--text-muted);">
            Please double-check the certificate number (e.g. <code>PCE-2026-101</code>) or contact the institute office for verification support.
          </p>
        `;
      }
    } catch (err) {
      resultBox.style.display = 'block';
      resultBox.className = 'result-card not-found';
      resultBox.innerHTML = `
        <div class="cert-status-badge not-found">Verification Server Offline</div>
        <p style="color: #991B1B; font-size: 0.92rem;">Could not connect to the verification server. Please verify your internet connection or try again.</p>
      `;
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        Verify Now
      `;
    }
  }
});
