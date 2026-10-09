/**
 * ==============================================================================
 * PERFECT COMPUTER EDUCATION - ADMIN PANEL JAVASCRIPT
 * Single Page Application Logic, JWT Auth, CRUD, Search, Reports & Settings
 * ==============================================================================
 */

let adminToken = localStorage.getItem('pce_admin_token') || '';
let currentStudents = [];
let currentCourses = [];
let currentPayments = [];
let currentCertificates = [];
let currentSettings = {};

document.addEventListener('DOMContentLoaded', () => {
  initAdminAuth();
  initAdminNav();
  initAdminEventListeners();
});

/* ==============================================================================
   1. AUTHENTICATION & SESSION
   ============================================================================== */
function initAdminAuth() {
  const loginScreen = document.getElementById('admin-login-screen');
  const adminApp = document.getElementById('admin-app');
  const loginForm = document.getElementById('admin-login-form');
  const pinInput = document.getElementById('admin-pin-input');
  const pinToggleBtn = document.getElementById('pin-toggle-btn');
  const logoutBtn = document.getElementById('admin-logout-btn');

  // Toggle PIN visibility
  if (pinToggleBtn && pinInput) {
    pinToggleBtn.addEventListener('click', () => {
      const type = pinInput.getAttribute('type') === 'password' ? 'text' : 'password';
      pinInput.setAttribute('type', type);
    });
  }

  // Handle Login Submit
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const pin = pinInput.value.trim();
      if (!pin) return;

      const submitBtn = document.getElementById('login-submit-btn');
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Verifying PIN...`;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ pin })
        });
        const data = await res.json();

        if (data.success && data.token) {
          adminToken = data.token;
          localStorage.setItem('pce_admin_token', adminToken);
          pinInput.value = '';
          showToast('Login Successful', 'Welcome to Perfect Computer Education Admin Portal', 'success');
          showAdminApp();
          loadAdminDashboard();
        } else {
          showToast('Login Failed', data.message || 'Invalid Admin PIN', 'error');
          pinInput.value = '';
          pinInput.focus();
        }
      } catch (err) {
        showToast('Server Offline', 'Could not connect to the backend server.', 'error');
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          Unlock Admin Dashboard
        `;
      }
    });
  }

  // Handle Logout
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      adminToken = '';
      localStorage.removeItem('pce_admin_token');
      showLoginScreen();
      showToast('Logged Out', 'Admin session ended successfully.', 'success');
    });
  }

  // Check initial token
  if (adminToken) {
    verifySession();
  } else {
    showLoginScreen();
  }
}

async function verifySession() {
  try {
    const res = await adminFetch('/api/admin/dashboard');
    if (res && res.success) {
      showAdminApp();
      loadAdminDashboard();
    } else {
      showLoginScreen();
    }
  } catch (err) {
    showLoginScreen();
  }
}

function showLoginScreen() {
  document.getElementById('admin-login-screen').style.display = 'flex';
  document.getElementById('admin-app').classList.remove('active');
}

function showAdminApp() {
  document.getElementById('admin-login-screen').style.display = 'none';
  document.getElementById('admin-app').classList.add('active');
}

// Authenticated Fetch Helper
async function adminFetch(url, options = {}) {
  options.headers = options.headers || {};
  options.headers['Authorization'] = `Bearer ${adminToken}`;
  if (options.body && typeof options.body === 'object' && !(options.body instanceof FormData)) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }

  const res = await fetch(url, options);
  if (res.status === 401) {
    adminToken = '';
    localStorage.removeItem('pce_admin_token');
    showLoginScreen();
    showToast('Session Expired', 'Please enter your Admin PIN to log in again.', 'error');
    throw new Error('Unauthorized');
  }
  return res.json();
}

/* ==============================================================================
   2. NAVIGATION & VIEW SWITCHING
   ============================================================================== */
function initAdminNav() {
  const navLinks = document.querySelectorAll('.admin-nav-link[data-view]');
  const viewTitle = document.getElementById('current-view-title');

  const titles = {
    'dashboard': 'Dashboard Overview',
    'students': 'Student Enrollment & Records',
    'courses': 'Course Catalog Management (6 Core Courses)',
    'fees': 'Fees Collection & Payment Receipts',
    'certificates': 'Certificate Generation & Issuance',
    'reports': 'Institute Reports & Data Export',
    'settings': 'Institute Settings & Security PIN'
  };

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const view = link.getAttribute('data-view');
      adminSwitchView(view);
    });
  });
}

function adminSwitchView(viewId) {
  const navLinks = document.querySelectorAll('.admin-nav-link[data-view]');
  const views = document.querySelectorAll('.admin-view');
  const viewTitle = document.getElementById('current-view-title');

  const titles = {
    'dashboard': 'Dashboard Overview',
    'students': 'Student Enrollment & Records',
    'courses': 'Course Catalog Management (6 Core Courses)',
    'fees': 'Fees Collection & Payment Receipts',
    'certificates': 'Certificate Generation & Issuance',
    'reports': 'Institute Reports & Data Export',
    'settings': 'Institute Settings & Security PIN'
  };

  navLinks.forEach(l => {
    if (l.getAttribute('data-view') === viewId) l.classList.add('active');
    else l.classList.remove('active');
  });

  views.forEach(v => {
    if (v.id === `view-${viewId}`) v.classList.add('active');
    else v.classList.remove('active');
  });

  if (viewTitle && titles[viewId]) {
    viewTitle.textContent = titles[viewId];
  }

  // Load view data
  if (viewId === 'dashboard') loadAdminDashboard();
  if (viewId === 'students') loadAdminStudents();
  if (viewId === 'courses') loadAdminCourses();
  if (viewId === 'fees') loadAdminFees();
  if (viewId === 'certificates') loadAdminCertificates();
  if (viewId === 'reports') loadAdminReports();
  if (viewId === 'settings') loadAdminSettings();
}

/* ==============================================================================
   3. DASHBOARD VIEW
   ============================================================================== */
async function loadAdminDashboard() {
  try {
    const data = await adminFetch('/api/admin/dashboard');
    if (!data.success) return;
    const d = data.dashboard;

    document.getElementById('stat-total-students').textContent = d.totalStudents;
    document.getElementById('stat-active-students').textContent = d.activeStudents;
    document.getElementById('stat-completed-students').textContent = d.completedStudents;
    document.getElementById('stat-pending-fees').textContent = `₹${(d.pendingFees || 0).toLocaleString()}`;

    // Recent Students table
    const recentTbody = document.getElementById('dashboard-recent-students');
    if (recentTbody) {
      if (!d.recentStudents || d.recentStudents.length === 0) {
        recentTbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--admin-muted);">No students found.</td></tr>`;
      } else {
        recentTbody.innerHTML = d.recentStudents.map(s => `
          <tr>
            <td>
              <div class="student-row-info">
                <img src="${s.photo || 'images/avatars/avatar-1.svg'}" class="student-row-avatar" alt="${s.fullName}" />
                <div>
                  <div style="font-weight: 700; color: var(--admin-dark);">${s.fullName}</div>
                  <div style="font-size: 0.78rem; color: var(--admin-muted);">${s.id}</div>
                </div>
              </div>
            </td>
            <td><strong>${s.course}</strong></td>
            <td>${s.mobile}</td>
            <td>₹${s.totalFees} / <span style="color: #059669;">₹${s.paidFees}</span></td>
            <td><span class="${s.pendingFees > 0 ? 'fee-pill-pending' : 'fee-pill-paid'}">₹${s.pendingFees}</span></td>
            <td><span class="status-pill status-${(s.status || 'Active').toLowerCase()}">${s.status}</span></td>
            <td>
              <button type="button" class="btn btn-outline btn-sm" onclick="adminViewStudentProfile('${s.id}')">Profile</button>
            </td>
          </tr>
        `).join('');
      }
    }
  } catch (err) {
    console.error('Error loading dashboard:', err);
  }
}

/* ==============================================================================
   4. STUDENTS VIEW
   ============================================================================== */
async function loadAdminStudents() {
  try {
    const res = await adminFetch('/api/admin/students');
    if (!res.success) return;
    currentStudents = res.students || [];
    renderStudentsTable(currentStudents);
  } catch (err) {
    console.error('Error loading students:', err);
  }
}

function renderStudentsTable(students) {
  const tbody = document.getElementById('students-table-body');
  if (!tbody) return;

  if (students.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 30px; color: var(--admin-muted);">No matching students found.</td></tr>`;
    return;
  }

  tbody.innerHTML = students.map(s => `
    <tr>
      <td>
        <div class="student-row-info">
          <img src="${s.photo || 'images/avatars/avatar-1.svg'}" class="student-row-avatar" alt="${s.fullName}" />
          <div>
            <div style="font-weight: 700; color: var(--admin-dark);">${s.fullName}</div>
            <div style="font-size: 0.78rem; color: var(--admin-muted); font-family: monospace;">${s.id}</div>
          </div>
        </div>
      </td>
      <td>${s.fatherName || '-'}</td>
      <td><span style="font-weight: 700; color: var(--primary);">${s.course}</span></td>
      <td>${s.mobile}</td>
      <td>${s.admissionDate || '-'}</td>
      <td>
        <div>₹${s.totalFees} / <strong style="color: #059669;">₹${s.paidFees}</strong></div>
        <div style="font-size: 0.8rem; color: ${s.pendingFees > 0 ? '#DC2626' : '#059669'};">Pend: ₹${s.pendingFees}</div>
      </td>
      <td><span class="status-pill status-${(s.status || 'Active').toLowerCase()}">${s.status}</span></td>
      <td>
        <div class="action-btn-group" style="justify-content: flex-end;">
          <button type="button" class="btn-icon btn-icon-primary" title="View Profile" onclick="adminViewStudentProfile('${s.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
          <button type="button" class="btn-icon" title="Edit Student" onclick="adminEditStudent('${s.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
          </button>
          <button type="button" class="btn-icon" title="Record Payment" onclick="adminQuickPayment('${s.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
          </button>
          <button type="button" class="btn-icon btn-icon-danger" title="Delete Student" onclick="adminDeleteStudent('${s.id}')">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

// Student Filters & Search Event Listeners
function initAdminEventListeners() {
  const searchInput = document.getElementById('students-search-input');
  const filterBtns = document.querySelectorAll('.student-filter-btn');

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const filtered = currentStudents.filter(s => 
        s.fullName.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.mobile.includes(q) ||
        s.course.toLowerCase().includes(q)
      );
      renderStudentsTable(filtered);
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const status = btn.getAttribute('data-status');
      if (status === 'all') {
        renderStudentsTable(currentStudents);
      } else {
        const filtered = currentStudents.filter(s => s.status === status);
        renderStudentsTable(filtered);
      }
    });
  });

  // Settings form submit
  const settingsForm = document.getElementById('institute-settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const updated = {
        instituteName: document.getElementById('set-inst-name').value.trim(),
        tagline: document.getElementById('set-inst-tagline').value.trim(),
        phone: document.getElementById('set-inst-phone').value.trim(),
        whatsappNumber: document.getElementById('set-inst-wa').value.trim(),
        email: document.getElementById('set-inst-email').value.trim(),
        address: document.getElementById('set-inst-address').value.trim(),
        authorizedPerson: document.getElementById('set-inst-auth').value.trim(),
        openingHours: document.getElementById('set-inst-hours').value.trim()
      };

      try {
        const res = await adminFetch('/api/admin/settings', {
          method: 'PUT',
          body: updated
        });
        if (res.success) {
          showToast('Settings Saved', 'Institute contact and branding updated successfully.', 'success');
        }
      } catch (err) {
        showToast('Error', 'Failed to update settings.', 'error');
      }
    });
  }

  // Change PIN submit
  const pinForm = document.getElementById('change-pin-form');
  if (pinForm) {
    pinForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const currentPin = document.getElementById('curr-pin-input').value.trim();
      const newPin = document.getElementById('new-pin-input').value.trim();
      const confirmPin = document.getElementById('confirm-pin-input').value.trim();

      if (newPin !== confirmPin) {
        showToast('Mismatch', 'New PIN and Confirm PIN do not match!', 'error');
        return;
      }

      try {
        const res = await adminFetch('/api/admin/change-pin', {
          method: 'POST',
          body: { currentPin, newPin }
        });
        if (res.success) {
          showToast('PIN Changed', res.message, 'success');
          pinForm.reset();
        } else {
          showToast('Failed', res.message, 'error');
        }
      } catch (err) {
        showToast('Error', 'Failed to change PIN.', 'error');
      }
    });
  }

  // Report Type select change
  const repSelect = document.getElementById('report-type-select');
  if (repSelect) {
    repSelect.addEventListener('change', () => loadAdminReports());
  }
}

/* ==============================================================================
   5. STUDENT MODAL OPERATIONS (ADD / EDIT / PROFILE / DELETE)
   ============================================================================== */
async function adminOpenAddStudent() {
  await loadCoursesDropdown();
  document.getElementById('modal-student-title').textContent = 'Add New Student';
  document.getElementById('student-form').reset();
  document.getElementById('stu-edit-id').value = '';
  document.getElementById('stu-admission-date').value = new Date().toISOString().split('T')[0];
  openAdminModal('modal-student');
}

async function loadCoursesDropdown() {
  if (currentCourses.length === 0) {
    const res = await adminFetch('/api/admin/courses');
    currentCourses = res.courses || [];
  }
  const select = document.getElementById('stu-course');
  if (select) {
    select.innerHTML = '<option value="">-- Choose Course --</option>' + 
      currentCourses.map(c => `<option value="${c.name}">${c.name} (₹${c.fees} - ${c.duration})</option>`).join('');
  }
}

function adminAutoFillCourseFees(courseName) {
  const course = currentCourses.find(c => c.name === courseName);
  if (course) {
    document.getElementById('stu-total-fees').value = course.fees || 0;
  }
}

async function adminEditStudent(id) {
  const student = currentStudents.find(s => s.id === id);
  if (!student) return;

  await loadCoursesDropdown();
  document.getElementById('modal-student-title').textContent = `Edit Student (${student.id})`;
  document.getElementById('stu-edit-id').value = student.id;
  document.getElementById('stu-name').value = student.fullName;
  document.getElementById('stu-father').value = student.fatherName || '';
  document.getElementById('stu-dob').value = student.dob || '';
  document.getElementById('stu-gender').value = student.gender || 'Male';
  document.getElementById('stu-status').value = student.status || 'Active';
  document.getElementById('stu-mobile').value = student.mobile || '';
  document.getElementById('stu-email').value = student.email || '';
  document.getElementById('stu-course').value = student.course || '';
  document.getElementById('stu-total-fees').value = student.totalFees || 0;
  document.getElementById('stu-paid-fees').value = student.paidFees || 0;
  document.getElementById('stu-admission-date').value = student.admissionDate || '';
  document.getElementById('stu-address').value = student.address || '';
  document.getElementById('stu-notes').value = student.notes || '';

  openAdminModal('modal-student');
}

async function adminSaveStudent() {
  const editId = document.getElementById('stu-edit-id').value;
  const fullName = document.getElementById('stu-name').value.trim();
  const mobile = document.getElementById('stu-mobile').value.trim();
  const course = document.getElementById('stu-course').value;
  const totalFees = Number(document.getElementById('stu-total-fees').value) || 0;
  const paidFees = Number(document.getElementById('stu-paid-fees').value) || 0;

  if (!fullName || !mobile || !course) {
    showToast('Missing Fields', 'Please enter full name, mobile number and select a course.', 'error');
    return;
  }

  const payload = {
    fullName,
    fatherName: document.getElementById('stu-father').value.trim(),
    dob: document.getElementById('stu-dob').value,
    gender: document.getElementById('stu-gender').value,
    status: document.getElementById('stu-status').value,
    mobile,
    email: document.getElementById('stu-email').value.trim(),
    course,
    totalFees,
    paidFees,
    admissionDate: document.getElementById('stu-admission-date').value || new Date().toISOString().split('T')[0],
    address: document.getElementById('stu-address').value.trim(),
    notes: document.getElementById('stu-notes').value.trim()
  };

  try {
    let res;
    if (editId) {
      res = await adminFetch(`/api/admin/students/${editId}`, { method: 'PUT', body: payload });
    } else {
      res = await adminFetch('/api/admin/students', { method: 'POST', body: payload });
    }

    if (res.success) {
      showToast('Student Saved', res.message, 'success');
      adminCloseModals();
      loadAdminStudents();
      loadAdminDashboard();
    }
  } catch (err) {
    showToast('Error', 'Failed to save student record.', 'error');
  }
}

async function adminDeleteStudent(id) {
  if (!confirm(`Are you sure you want to delete student record ${id}? This cannot be undone.`)) return;

  try {
    const res = await adminFetch(`/api/admin/students/${id}`, { method: 'DELETE' });
    if (res.success) {
      showToast('Deleted', res.message, 'success');
      loadAdminStudents();
      loadAdminDashboard();
    }
  } catch (err) {
    showToast('Error', 'Failed to delete student.', 'error');
  }
}

function adminViewStudentProfile(id) {
  const student = currentStudents.find(s => s.id === id);
  if (!student) return;

  const container = document.getElementById('profile-modal-body');
  container.innerHTML = `
    <div style="display: flex; align-items: center; gap: 18px; margin-bottom: 20px; padding-bottom: 18px; border-bottom: 1px solid var(--admin-border);">
      <img src="${student.photo || 'images/avatars/avatar-1.svg'}" style="width: 68px; height: 68px; border-radius: 50%;" alt="${student.fullName}" />
      <div>
        <h3 style="font-size: 1.35rem; font-weight: 800; color: var(--admin-dark); margin-bottom: 4px;">${student.fullName}</h3>
        <div style="font-size: 0.85rem; color: var(--admin-muted);">ID: <strong>${student.id}</strong> | Status: <span class="status-pill status-${(student.status||'active').toLowerCase()}">${student.status}</span></div>
      </div>
    </div>

    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 20px;">
      <div><span style="color: var(--admin-muted); font-size: 0.82rem;">Father's Name:</span><br /><strong>${student.fatherName || '-'}</strong></div>
      <div><span style="color: var(--admin-muted); font-size: 0.82rem;">Enrolled Course:</span><br /><strong style="color: var(--primary);">${student.course}</strong></div>
      <div><span style="color: var(--admin-muted); font-size: 0.82rem;">Mobile Number:</span><br /><strong>${student.mobile}</strong></div>
      <div><span style="color: var(--admin-muted); font-size: 0.82rem;">Email:</span><br /><strong>${student.email || '-'}</strong></div>
      <div><span style="color: var(--admin-muted); font-size: 0.82rem;">Date of Birth:</span><br /><strong>${student.dob || '-'}</strong></div>
      <div><span style="color: var(--admin-muted); font-size: 0.82rem;">Admission Date:</span><br /><strong>${student.admissionDate || '-'}</strong></div>
    </div>

    <div style="background: #F8FAFC; border: 1px solid var(--admin-border); border-radius: var(--radius-md); padding: 16px; margin-bottom: 20px;">
      <h4 style="font-size: 0.95rem; font-weight: 700; margin-bottom: 8px;">Fee Summary</h4>
      <div style="display: flex; justify-content: space-between; font-size: 0.92rem;">
        <div>Total: <strong>₹${student.totalFees}</strong></div>
        <div>Paid: <strong style="color: #059669;">₹${student.paidFees}</strong></div>
        <div>Pending: <strong style="color: #DC2626;">₹${student.pendingFees}</strong></div>
      </div>
    </div>

    ${student.address ? `<div style="margin-bottom: 14px;"><span style="color: var(--admin-muted); font-size: 0.82rem;">Address:</span><br />${student.address}</div>` : ''}
    ${student.notes ? `<div><span style="color: var(--admin-muted); font-size: 0.82rem;">Notes:</span><br /><em>${student.notes}</em></div>` : ''}
  `;

  document.getElementById('profile-print-btn').onclick = () => window.print();
  openAdminModal('modal-student-profile');
}

/* ==============================================================================
   6. COURSES VIEW & CRUD
   ============================================================================== */
async function loadAdminCourses() {
  try {
    const res = await adminFetch('/api/admin/courses');
    if (!res.success) return;
    currentCourses = res.courses || [];
    renderCoursesGrid(currentCourses);
  } catch (err) {
    console.error('Error loading courses:', err);
  }
}

function renderCoursesGrid(courses) {
  const container = document.getElementById('admin-courses-grid');
  if (!container) return;

  container.innerHTML = courses.map(c => `
    <div class="course-card">
      <span class="course-badge-top ${c.status === 'Active' ? 'badge-green' : 'badge-hot'}">${c.status}</span>
      <div class="course-icon-box">
        <img src="images/courses/${c.id}.svg" alt="${c.name}" onerror="this.src='images/courses/ccc.svg'" width="68" height="68" />
      </div>
      <h3 class="course-title">${c.name}</h3>
      <div class="course-meta-row">
        <span class="course-meta-item">⏱ ${c.duration}</span>
        <span class="course-meta-item" style="color: #059669; background: #ECFDF5;">₹${c.fees} Fees</span>
      </div>
      <p class="course-desc">${c.description}</p>
      <div style="margin-top: auto; padding-top: 16px; border-top: 1px solid var(--admin-border); display: flex; justify-content: space-between; align-items: center;">
        <button type="button" class="btn btn-outline btn-sm" onclick="adminEditCourse('${c.id}')">Edit Details</button>
        <button type="button" class="btn btn-sm ${c.status === 'Active' ? 'btn-white' : 'btn-primary'}" onclick="adminToggleCourseStatus('${c.id}')">
          ${c.status === 'Active' ? 'Deactivate' : 'Activate'}
        </button>
      </div>
    </div>
  `).join('');
}

function adminOpenAddCourse() {
  document.getElementById('modal-course-title').textContent = 'Add Custom Course';
  document.getElementById('course-form').reset();
  document.getElementById('course-edit-id').value = '';
  openAdminModal('modal-course');
}

function adminEditCourse(id) {
  const course = currentCourses.find(c => c.id === id);
  if (!course) return;

  document.getElementById('modal-course-title').textContent = `Edit Course: ${course.name}`;
  document.getElementById('course-edit-id').value = course.id;
  document.getElementById('course-name').value = course.name;
  document.getElementById('course-duration').value = course.duration || '';
  document.getElementById('course-fees').value = course.fees || 0;
  document.getElementById('course-desc').value = course.description || '';
  document.getElementById('course-syllabus').value = Array.isArray(course.syllabus) ? course.syllabus.join('\n') : '';
  document.getElementById('course-status').value = course.status || 'Active';

  openAdminModal('modal-course');
}

async function adminSaveCourse() {
  const editId = document.getElementById('course-edit-id').value;
  const name = document.getElementById('course-name').value.trim();
  const duration = document.getElementById('course-duration').value.trim();
  const fees = Number(document.getElementById('course-fees').value) || 0;
  const description = document.getElementById('course-desc').value.trim();
  const syllabusRaw = document.getElementById('course-syllabus').value.trim();
  const status = document.getElementById('course-status').value;

  if (!name || !duration) {
    showToast('Required Fields', 'Please enter course name and duration', 'error');
    return;
  }

  const syllabus = syllabusRaw ? syllabusRaw.split('\n').map(s => s.trim()).filter(Boolean) : [];

  const payload = {
    name: name.toUpperCase(),
    duration,
    fees,
    description,
    syllabus,
    status
  };

  try {
    let res;
    if (editId) {
      res = await adminFetch(`/api/admin/courses/${editId}`, { method: 'PUT', body: payload });
    } else {
      res = await adminFetch('/api/admin/courses', { method: 'POST', body: payload });
    }

    if (res.success) {
      showToast('Course Saved', res.message, 'success');
      adminCloseModals();
      loadAdminCourses();
    }
  } catch (err) {
    showToast('Error', 'Failed to save course.', 'error');
  }
}

async function adminToggleCourseStatus(id) {
  const course = currentCourses.find(c => c.id === id);
  if (!course) return;
  const newStatus = course.status === 'Active' ? 'Inactive' : 'Active';
  course.status = newStatus;

  try {
    const res = await adminFetch(`/api/admin/courses/${id}`, { method: 'PUT', body: course });
    if (res.success) {
      showToast('Status Updated', `${course.name} is now ${newStatus}`, 'success');
      loadAdminCourses();
    }
  } catch (err) {
    showToast('Error', 'Failed to toggle status.', 'error');
  }
}

/* ==============================================================================
   7. FEES MANAGEMENT & RECEIPTS
   ============================================================================== */
async function loadAdminFees() {
  try {
    const pRes = await adminFetch('/api/admin/payments');
    const sRes = await adminFetch('/api/admin/students');
    currentPayments = pRes.payments || [];
    currentStudents = sRes.students || [];

    let totalCollected = 0;
    let totalPending = 0;

    currentStudents.forEach(s => {
      totalCollected += Number(s.paidFees) || 0;
      totalPending += Number(s.pendingFees) || 0;
    });

    document.getElementById('fees-collected-val').textContent = `₹${totalCollected.toLocaleString()}`;
    document.getElementById('fees-pending-val').textContent = `₹${totalPending.toLocaleString()}`;

    renderFeesTable(currentPayments);
  } catch (err) {
    console.error('Error loading fees:', err);
  }
}

function renderFeesTable(payments) {
  const tbody = document.getElementById('fees-table-body');
  if (!tbody) return;

  if (payments.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 24px; color: var(--admin-muted);">No payment records found.</td></tr>`;
    return;
  }

  tbody.innerHTML = payments.map(p => `
    <tr>
      <td><strong style="font-family: monospace; color: var(--primary);">${p.receiptNo}</strong></td>
      <td><strong>${p.studentName}</strong></td>
      <td>${p.course}</td>
      <td><strong style="color: #059669;">₹${p.amount}</strong></td>
      <td>${p.paymentDate}</td>
      <td><span class="status-pill" style="background: #EFF6FF; color: #1D4ED8;">${p.method}</span></td>
      <td>${p.notes || '-'}</td>
      <td>
        <a href="print-receipt.html?receiptNo=${p.receiptNo}" target="_blank" class="btn btn-outline btn-sm">
          Print Receipt
        </a>
      </td>
    </tr>
  `).join('');
}

function adminOpenAddPayment() {
  const select = document.getElementById('pay-student-id');
  select.innerHTML = '<option value="">-- Choose Student --</option>' + 
    currentStudents.map(s => `<option value="${s.id}">${s.fullName} (${s.id}) - Pend: ₹${s.pendingFees}</option>`).join('');

  document.getElementById('payment-form').reset();
  document.getElementById('pay-date').value = new Date().toISOString().split('T')[0];
  document.getElementById('pay-course-name').textContent = '-';
  document.getElementById('pay-pending-amt').textContent = '₹0';
  openAdminModal('modal-payment');
}

function adminQuickPayment(studentId) {
  adminOpenAddPayment();
  const select = document.getElementById('pay-student-id');
  select.value = studentId;
  adminOnPaymentStudentSelect(studentId);
}

function adminOnPaymentStudentSelect(studentId) {
  const student = currentStudents.find(s => s.id === studentId);
  if (student) {
    document.getElementById('pay-course-name').textContent = student.course;
    document.getElementById('pay-pending-amt').textContent = `₹${student.pendingFees}`;
    document.getElementById('pay-amount').value = student.pendingFees > 0 ? student.pendingFees : 1000;
  }
}

async function adminSavePayment() {
  const studentId = document.getElementById('pay-student-id').value;
  const amount = Number(document.getElementById('pay-amount').value);
  const paymentDate = document.getElementById('pay-date').value;
  const method = document.getElementById('pay-method').value;
  const notes = document.getElementById('pay-notes').value.trim();

  if (!studentId || !amount || amount <= 0) {
    showToast('Invalid Amount', 'Please select a student and valid amount', 'error');
    return;
  }

  const student = currentStudents.find(s => s.id === studentId);

  const payload = {
    studentId,
    studentName: student ? student.fullName : 'Student',
    course: student ? student.course : 'Computer Course',
    amount,
    paymentDate,
    method,
    notes
  };

  try {
    const res = await adminFetch('/api/admin/payments', { method: 'POST', body: payload });
    if (res.success) {
      showToast('Payment Recorded', `Receipt generated: ${res.payment.receiptNo}`, 'success');
      adminCloseModals();
      loadAdminFees();
      loadAdminStudents();
      loadAdminDashboard();
      // Offer opening receipt in new tab
      window.open(`print-receipt.html?receiptNo=${res.payment.receiptNo}`, '_blank');
    }
  } catch (err) {
    showToast('Error', 'Failed to save payment.', 'error');
  }
}

/* ==============================================================================
   8. CERTIFICATES VIEW & GENERATION
   ============================================================================== */
async function loadAdminCertificates() {
  try {
    const res = await adminFetch('/api/admin/certificates');
    const sRes = await adminFetch('/api/admin/students');
    currentCertificates = res.certificates || [];
    currentStudents = sRes.students || [];
    renderCertificatesTable(currentCertificates);
  } catch (err) {
    console.error('Error loading certificates:', err);
  }
}

function renderCertificatesTable(certs) {
  const tbody = document.getElementById('certificates-table-body');
  if (!tbody) return;

  if (certs.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 24px; color: var(--admin-muted);">No certificates generated yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = certs.map(c => `
    <tr>
      <td><strong style="font-family: monospace; color: var(--primary);">${c.certificateNo}</strong></td>
      <td><strong>${c.studentName}</strong></td>
      <td>${c.course}</td>
      <td>${c.issueDate}</td>
      <td>${c.completionDate}</td>
      <td><span class="status-pill status-completed">${c.grade || 'Grade A'}</span></td>
      <td><span class="status-pill status-active">✓ ${c.status}</span></td>
      <td style="text-align: right;">
        <a href="print-certificate.html?certNo=${c.certificateNo}" target="_blank" class="btn btn-outline btn-sm">
          Print / PDF
        </a>
        <a href="verify.html?certNo=${c.certificateNo}" target="_blank" class="btn btn-primary btn-sm" style="margin-left: 6px;">
          Verify ↗
        </a>
      </td>
    </tr>
  `).join('');
}

function adminOpenGenerateCertificate() {
  const select = document.getElementById('cert-student-id');
  select.innerHTML = '<option value="">-- Choose Student --</option>' + 
    currentStudents.map(s => `<option value="${s.id}">${s.fullName} (${s.course})</option>`).join('');

  document.getElementById('certificate-form').reset();
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('cert-comp-date').value = today;
  document.getElementById('cert-issue-date').value = today;
  openAdminModal('modal-certificate');
}

function adminOnCertStudentSelect(studentId) {
  const student = currentStudents.find(s => s.id === studentId);
  if (student) {
    document.getElementById('cert-course-name').value = student.course;
  }
}

async function adminSaveCertificate() {
  const studentId = document.getElementById('cert-student-id').value;
  const course = document.getElementById('cert-course-name').value;
  const completionDate = document.getElementById('cert-comp-date').value;
  const issueDate = document.getElementById('cert-issue-date').value;
  const grade = document.getElementById('cert-grade').value;
  const customNo = document.getElementById('cert-custom-no').value.trim();

  if (!studentId || !course) {
    showToast('Select Student', 'Please select a student for certificate generation', 'error');
    return;
  }

  const student = currentStudents.find(s => s.id === studentId);

  const payload = {
    studentId,
    studentName: student ? student.fullName : 'Student',
    course,
    completionDate,
    issueDate,
    grade,
    certificateNo: customNo || ''
  };

  try {
    const res = await adminFetch('/api/admin/certificates', { method: 'POST', body: payload });
    if (res.success) {
      showToast('Certificate Created', `Certificate Number: ${res.certificate.certificateNo}`, 'success');
      adminCloseModals();
      loadAdminCertificates();
      loadAdminStudents();
      loadAdminDashboard();
      window.open(`print-certificate.html?certNo=${res.certificate.certificateNo}`, '_blank');
    }
  } catch (err) {
    showToast('Error', 'Failed to generate certificate.', 'error');
  }
}

/* ==============================================================================
   9. REPORTS & CSV EXPORT
   ============================================================================== */
async function loadAdminReports() {
  const repType = document.getElementById('report-type-select').value;
  const thead = document.getElementById('report-table-head');
  const tbody = document.getElementById('report-table-body');

  await loadAdminStudents();

  if (repType === 'all' || repType === 'active' || repType === 'completed') {
    thead.innerHTML = `
      <tr>
        <th>Student ID</th>
        <th>Full Name</th>
        <th>Course</th>
        <th>Mobile</th>
        <th>Total Fees</th>
        <th>Paid Fees</th>
        <th>Pending Fees</th>
        <th>Status</th>
      </tr>
    `;

    const list = repType === 'all' 
      ? currentStudents 
      : currentStudents.filter(s => s.status.toLowerCase() === repType);

    tbody.innerHTML = list.map(s => `
      <tr>
        <td>${s.id}</td>
        <td><strong>${s.fullName}</strong></td>
        <td>${s.course}</td>
        <td>${s.mobile}</td>
        <td>₹${s.totalFees}</td>
        <td>₹${s.paidFees}</td>
        <td style="color: ${s.pendingFees > 0 ? '#DC2626' : '#059669'};">₹${s.pendingFees}</td>
        <td>${s.status}</td>
      </tr>
    `).join('');
  } else if (repType === 'pending-fees') {
    thead.innerHTML = `
      <tr>
        <th>Student ID</th>
        <th>Full Name</th>
        <th>Course</th>
        <th>Mobile</th>
        <th>Total Fees</th>
        <th>Paid Fees</th>
        <th>Pending Due</th>
      </tr>
    `;
    const list = currentStudents.filter(s => Number(s.pendingFees) > 0);
    tbody.innerHTML = list.map(s => `
      <tr>
        <td>${s.id}</td>
        <td><strong>${s.fullName}</strong></td>
        <td>${s.course}</td>
        <td>${s.mobile}</td>
        <td>₹${s.totalFees}</td>
        <td>₹${s.paidFees}</td>
        <td><strong style="color: #DC2626;">₹${s.pendingFees}</strong></td>
      </tr>
    `).join('');
  } else if (repType === 'certificates') {
    const res = await adminFetch('/api/admin/certificates');
    const certs = res.certificates || [];
    thead.innerHTML = `
      <tr>
        <th>Certificate No</th>
        <th>Student Name</th>
        <th>Course</th>
        <th>Issue Date</th>
        <th>Grade</th>
        <th>Status</th>
      </tr>
    `;
    tbody.innerHTML = certs.map(c => `
      <tr>
        <td><strong>${c.certificateNo}</strong></td>
        <td>${c.studentName}</td>
        <td>${c.course}</td>
        <td>${c.issueDate}</td>
        <td>${c.grade || 'Passed'}</td>
        <td>${c.status}</td>
      </tr>
    `).join('');
  }
}

function adminExportReportCSV() {
  const table = document.getElementById('report-table');
  if (!table) return;

  let csv = [];
  const rows = table.querySelectorAll('tr');

  rows.forEach(row => {
    const cols = row.querySelectorAll('th, td');
    let rowData = [];
    cols.forEach(col => {
      let text = col.innerText.replace(/"/g, '""').trim();
      rowData.push(`"${text}"`);
    });
    csv.push(rowData.join(','));
  });

  const csvFile = new Blob([csv.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const downloadLink = document.createElement('a');
  downloadLink.download = `PCE_Report_${new Date().toISOString().split('T')[0]}.csv`;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();
  showToast('Export Complete', 'CSV report file downloaded successfully.', 'success');
}

/* ==============================================================================
   10. SETTINGS VIEW
   ============================================================================== */
async function loadAdminSettings() {
  try {
    const res = await adminFetch('/api/admin/settings');
    if (!res.success) return;
    currentSettings = res.settings || {};

    document.getElementById('set-inst-name').value = currentSettings.instituteName || '';
    document.getElementById('set-inst-tagline').value = currentSettings.tagline || '';
    document.getElementById('set-inst-phone').value = currentSettings.phone || '';
    document.getElementById('set-inst-wa').value = currentSettings.whatsappNumber || '';
    document.getElementById('set-inst-email').value = currentSettings.email || '';
    document.getElementById('set-inst-address').value = currentSettings.address || '';
    document.getElementById('set-inst-auth').value = currentSettings.authorizedPerson || '';
    document.getElementById('set-inst-hours').value = currentSettings.openingHours || '';
  } catch (err) {
    console.error('Error loading settings:', err);
  }
}

/* ==============================================================================
   11. MODALS & TOAST HELPERS
   ============================================================================== */
function openAdminModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) modal.classList.add('active');
}

function adminCloseModals() {
  document.querySelectorAll('.admin-modal-overlay.active').forEach(m => m.classList.remove('active'));
}

function showToast(title, message, type = 'success') {
  let container = document.getElementById('admin-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    container.id = 'admin-toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${type === 'success' ? '✓' : '⚠️'}</div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-msg">${message}</div>
    </div>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 20);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}
