# ==============================================================================
# PERFECT COMPUTER EDUCATION - BACKEND REST API & STATIC SERVER
# Windows Native PowerShell .NET Server with JWT Auth & Database
# ==============================================================================

$port = 8080
$baseDir = "C:\Users\DELL\.gemini\antigravity\scratch\perfect-computer-education"
$dbPath = Join-Path $baseDir "data\database.json"
$jwtSecret = "pce_jwt_secure_secret_key_2026_perfect_computer_education_backend"

# Ensure Database Exists
if (!(Test-Path $dbPath)) {
    Write-Error "Database file not found at $dbPath"
    exit 1
}

# Helper: Compute SHA-256 Hash
function Get-Sha256Hash([string]$inputStr) {
    $bytes = [System.Text.Encoding]::UTF8.GetBytes($inputStr)
    $sha256 = [System.Security.Cryptography.SHA256]::Create()
    $hashBytes = $sha256.ComputeHash($bytes)
    return ([System.BitConverter]::ToString($hashBytes)).Replace("-", "").ToLower()
}

# Helper: Create HMAC-SHA256 Signed JWT-like Token
function Create-AuthToken() {
    $header = @{ alg = "HS256"; typ = "JWT" } | ConvertTo-Json -Compress
    $headerB64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($header)).TrimEnd('=').Replace('+', '-').Replace('/', '_')

    $now = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
    $exp = $now + 86400 # 24 hours
    $payload = @{ role = "admin"; iat = $now; exp = $exp } | ConvertTo-Json -Compress
    $payloadB64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($payload)).TrimEnd('=').Replace('+', '-').Replace('/', '_')

    $unsignedToken = "$headerB64.$payloadB64"
    $hmac = New-Object System.Security.Cryptography.HMACSHA256
    $hmac.Key = [System.Text.Encoding]::UTF8.GetBytes($jwtSecret)
    $signatureBytes = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($unsignedToken))
    $sigB64 = [Convert]::ToBase64String($signatureBytes).TrimEnd('=').Replace('+', '-').Replace('/', '_')

    return "$unsignedToken.$sigB64"
}

# Helper: Verify Auth Token
function Verify-AuthToken([string]$token) {
    if ([string]::IsNullOrWhiteSpace($token)) { return $false }
    $parts = $token.Split('.')
    if ($parts.Length -ne 3) { return $false }

    $unsignedToken = "$($parts[0]).$($parts[1])"
    $hmac = New-Object System.Security.Cryptography.HMACSHA256
    $hmac.Key = [System.Text.Encoding]::UTF8.GetBytes($jwtSecret)
    $expectedSigBytes = $hmac.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($unsignedToken))
    $expectedSigB64 = [Convert]::ToBase64String($expectedSigBytes).TrimEnd('=').Replace('+', '-').Replace('/', '_')

    if ($expectedSigB64 -ne $parts[2]) { return $false }

    try {
        $pad = $parts[1].Length % 4
        $b64 = $parts[1].Replace('-', '+').Replace('_', '/')
        if ($pad -eq 2) { $b64 += "==" }
        elseif ($pad -eq 3) { $b64 += "=" }
        $jsonStr = [System.Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($b64))
        $payload = $jsonStr | ConvertFrom-Json
        $now = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
        if ($payload.exp -lt $now) { return $false }
        return $true
    } catch {
        return $false
    }
}

# Helper: Read Database
function Get-Database() {
    $raw = [System.IO.File]::ReadAllText($dbPath, [System.Text.Encoding]::UTF8)
    return ($raw | ConvertFrom-Json)
}

# Helper: Save Database
function Save-Database($dbObj) {
    $json = $dbObj | ConvertTo-Json -Depth 10
    [System.IO.File]::WriteAllText($dbPath, $json, [System.Text.Encoding]::UTF8)
}

# MIME Types Dictionary
$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".htm"  = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".svg"  = "image/svg+xml"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".gif"  = "image/gif"
    ".ico"  = "image/x-icon"
}

# Start HTTP Listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Output "================================================================="
Write-Output "PERFECT COMPUTER EDUCATION - SERVER STARTED"
Write-Output "Live URL: http://localhost:$port/"
Write-Output "Admin Panel: http://localhost:$port/admin"
Write-Output "Certificate Verification: http://localhost:$port/verify-certificate"
Write-Output "Default Demo Admin PIN: 1234"
Write-Output "================================================================="

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        # CORS Headers
        $response.AddHeader("Access-Control-Allow-Origin", "*")
        $response.AddHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        $response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if ($request.HttpMethod -eq "OPTIONS") {
            $response.StatusCode = 204
            $response.Close()
            continue
        }

        $urlPath = $request.Url.LocalPath
        $httpMethod = $request.HttpMethod

        # Read Request Body for POST / PUT
        $bodyJson = $null
        if ($request.HasEntityBody) {
            $reader = New-Object System.IO.StreamReader($request.InputStream, [System.Text.Encoding]::UTF8)
            $bodyStr = $reader.ReadToEnd()
            if (![string]::IsNullOrWhiteSpace($bodyStr)) {
                try { $bodyJson = $bodyStr | ConvertFrom-Json } catch {}
            }
        }

        # Helper to Send JSON Response
        $sendJson = {
            param($data, [int]$status = 200)
            $jsonStr = $data | ConvertTo-Json -Depth 10
            $bytes = [System.Text.Encoding]::UTF8.GetBytes($jsonStr)
            $response.ContentType = "application/json; charset=utf-8"
            $response.StatusCode = $status
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
            $response.Close()
        }

        # =====================================================================
        # 1. API ROUTES
        # =====================================================================
        if ($urlPath.StartsWith("/api/")) {
            
            # --- AUTH: LOGIN ---
            if ($urlPath -eq "/api/auth/login" -and $httpMethod -eq "POST") {
                $db = Get-Database
                $pin = $bodyJson.pin
                if ([string]::IsNullOrWhiteSpace($pin)) {
                    & $sendJson @{ success = $false; message = "Please enter Admin PIN" } 400
                    continue
                }

                $inputHash = Get-Sha256Hash $pin.Trim()
                if ($inputHash -eq $db.adminAuth.pinHash) {
                    $token = Create-AuthToken
                    & $sendJson @{ success = $true; token = $token; message = "Login successful" } 200
                } else {
                    & $sendJson @{ success = $false; message = "Invalid Admin PIN. Please try again." } 401
                }
                continue
            }

            # --- PUBLIC: COURSES ---
            if ($urlPath -eq "/api/public/courses" -and $httpMethod -eq "GET") {
                $db = Get-Database
                $activeCourses = @($db.courses | Where-Object { $_.status -eq "Active" })
                & $sendJson @{ success = $true; courses = $activeCourses } 200
                continue
            }

            # --- PUBLIC: SETTINGS ---
            if ($urlPath -eq "/api/public/settings" -and $httpMethod -eq "GET") {
                $db = Get-Database
                & $sendJson @{ success = $true; settings = $db.settings } 200
                continue
            }

            # --- PUBLIC: VERIFY CERTIFICATE ---
            if ($urlPath -eq "/api/public/verify-certificate" -and $httpMethod -eq "GET") {
                $db = Get-Database
                $certNo = $request.QueryString["certNo"]
                if ([string]::IsNullOrWhiteSpace($certNo)) {
                    & $sendJson @{ success = $false; message = "Please provide certificate number" } 400
                    continue
                }

                $certClean = $certNo.Trim().ToUpper()
                $found = $null
                foreach ($c in $db.certificates) {
                    if ($c.certificateNo.ToUpper() -eq $certClean) {
                        $found = $c
                        break
                    }
                }

                if ($found) {
                    # Safe public data only (No private contact or financial details)
                    $safeData = @{
                        certificateNo = $found.certificateNo
                        studentName = $found.studentName
                        course = $found.course
                        issueDate = $found.issueDate
                        completionDate = $found.completionDate
                        grade = $found.grade
                        status = "Verified Successfully"
                        authorizedSignatory = $found.authorizedSignatory
                    }
                    & $sendJson @{ success = $true; found = $true; certificate = $safeData } 200
                } else {
                    & $sendJson @{ success = $true; found = $false; message = "No verified certificate found for Certificate Number: $certNo" } 200
                }
                continue
            }

            # =================================================================
            # PROTECTED ADMIN API ROUTES (Token Required)
            # =================================================================
            $authHeader = $request.Headers["Authorization"]
            $token = $null
            if ($authHeader -and $authHeader.StartsWith("Bearer ")) {
                $token = $authHeader.Substring(7).Trim()
            }

            if (!(Verify-AuthToken $token)) {
                & $sendJson @{ success = $false; message = "Unauthorized. Please enter your Admin PIN to log in." } 401
                continue
            }

            # --- ADMIN: DASHBOARD ---
            if ($urlPath -eq "/api/admin/dashboard" -and $httpMethod -eq "GET") {
                $db = Get-Database
                $students = @($db.students)
                $courses = @($db.courses)
                $certificates = @($db.certificates)
                $payments = @($db.payments)

                $totalStudents = $students.Count
                $activeStudents = @($students | Where-Object { $_.status -eq "Active" }).Count
                $completedStudents = @($students | Where-Object { $_.status -eq "Completed" }).Count
                $inactiveStudents = @($students | Where-Object { $_.status -eq "Inactive" }).Count

                $totalFees = 0
                $paidFees = 0
                $pendingFees = 0
                foreach ($s in $students) {
                    $totalFees += [int]$s.totalFees
                    $paidFees += [int]$s.paidFees
                    $pendingFees += [int]$s.pendingFees
                }

                $dashboardData = @{
                    totalStudents = $totalStudents
                    activeStudents = $activeStudents
                    completedStudents = $completedStudents
                    inactiveStudents = $inactiveStudents
                    totalCourses = $courses.Count
                    certificatesIssued = $certificates.Count
                    totalFees = $totalFees
                    paidFees = $paidFees
                    pendingFees = $pendingFees
                    recentStudents = @($students | Select-Object -Last 5)
                    recentPayments = @($payments | Select-Object -Last 5)
                    recentCertificates = @($certificates | Select-Object -Last 5)
                }
                & $sendJson @{ success = $true; dashboard = $dashboardData } 200
                continue
            }

            # --- ADMIN: STUDENTS CRUD ---
            if ($urlPath -eq "/api/admin/students" -and $httpMethod -eq "GET") {
                $db = Get-Database
                & $sendJson @{ success = $true; students = $db.students } 200
                continue
            }

            if ($urlPath -eq "/api/admin/students" -and $httpMethod -eq "POST") {
                $db = Get-Database
                $newStudent = $bodyJson
                
                # Auto-generate ID if empty
                if ([string]::IsNullOrWhiteSpace($newStudent.id)) {
                    $nextNum = $db.students.Count + 1
                    $newStudent | Add-Member -MemberType NoteProperty -Name "id" -Value ("STU-2026-" + $nextNum.ToString("D3")) -Force
                }

                # Auto calculate pending fees
                $tot = [int]$newStudent.totalFees
                $pd = [int]$newStudent.paidFees
                $pend = $tot - $pd
                if ($pend -lt 0) { $pend = 0 }
                $newStudent | Add-Member -MemberType NoteProperty -Name "pendingFees" -Value $pend -Force

                if ([string]::IsNullOrWhiteSpace($newStudent.photo)) {
                    $newStudent | Add-Member -MemberType NoteProperty -Name "photo" -Value "images/avatars/avatar-1.svg" -Force
                }

                $studentList = [System.Collections.ArrayList]@($db.students)
                $studentList.Add($newStudent) | Out-Null
                $db.students = $studentList

                # Record Initial Payment if paidFees > 0
                if ($pd -gt 0) {
                    $rcpNum = $db.payments.Count + 1
                    $rcp = @{
                        receiptNo = "RCP-2026-" + (1000 + $rcpNum)
                        studentId = $newStudent.id
                        studentName = $newStudent.fullName
                        course = $newStudent.course
                        amount = $pd
                        paymentDate = if ($newStudent.admissionDate) { $newStudent.admissionDate } else { (Get-Date -Format "yyyy-MM-dd") }
                        method = "Cash / UPI"
                        notes = "Admission Initial Fee Payment"
                    }
                    $paymentList = [System.Collections.ArrayList]@($db.payments)
                    $paymentList.Add($rcp) | Out-Null
                    $db.payments = $paymentList
                }

                Save-Database $db
                & $sendJson @{ success = $true; message = "Student added successfully"; student = $newStudent } 201
                continue
            }

            if ($urlPath.StartsWith("/api/admin/students/") -and $httpMethod -eq "PUT") {
                $id = $urlPath.Substring(20).Trim()
                $db = Get-Database
                $updated = $bodyJson

                $foundIndex = -1
                for ($i = 0; $i -lt $db.students.Count; $i++) {
                    if ($db.students[$i].id -eq $id) {
                        $foundIndex = $i
                        break
                    }
                }

                if ($foundIndex -ge 0) {
                    $tot = [int]$updated.totalFees
                    $pd = [int]$updated.paidFees
                    $pend = $tot - $pd
                    if ($pend -lt 0) { $pend = 0 }
                    $updated | Add-Member -MemberType NoteProperty -Name "pendingFees" -Value $pend -Force
                    $updated | Add-Member -MemberType NoteProperty -Name "id" -Value $id -Force

                    $db.students[$foundIndex] = $updated
                    Save-Database $db
                    & $sendJson @{ success = $true; message = "Student updated successfully"; student = $updated } 200
                } else {
                    & $sendJson @{ success = $false; message = "Student not found" } 404
                }
                continue
            }

            if ($urlPath.StartsWith("/api/admin/students/") -and $httpMethod -eq "DELETE") {
                $id = $urlPath.Substring(20).Trim()
                $db = Get-Database
                $filtered = @($db.students | Where-Object { $_.id -ne $id })
                $db.students = $filtered
                Save-Database $db
                & $sendJson @{ success = $true; message = "Student deleted successfully" } 200
                continue
            }

            # --- ADMIN: COURSES CRUD ---
            if ($urlPath -eq "/api/admin/courses" -and $httpMethod -eq "GET") {
                $db = Get-Database
                & $sendJson @{ success = $true; courses = $db.courses } 200
                continue
            }

            if ($urlPath -eq "/api/admin/courses" -and $httpMethod -eq "POST") {
                $db = Get-Database
                $newCourse = $bodyJson
                if ([string]::IsNullOrWhiteSpace($newCourse.id)) {
                    $newCourse | Add-Member -MemberType NoteProperty -Name "id" -Value ($newCourse.name.ToLower().Replace(" ", "-")) -Force
                }
                $cList = [System.Collections.ArrayList]@($db.courses)
                $cList.Add($newCourse) | Out-Null
                $db.courses = $cList
                Save-Database $db
                & $sendJson @{ success = $true; message = "Course added successfully"; course = $newCourse } 201
                continue
            }

            if ($urlPath.StartsWith("/api/admin/courses/") -and $httpMethod -eq "PUT") {
                $id = $urlPath.Substring(19).Trim()
                $db = Get-Database
                $updated = $bodyJson
                $foundIndex = -1
                for ($i = 0; $i -lt $db.courses.Count; $i++) {
                    if ($db.courses[$i].id -eq $id) {
                        $foundIndex = $i
                        break
                    }
                }

                if ($foundIndex -ge 0) {
                    $updated | Add-Member -MemberType NoteProperty -Name "id" -Value $id -Force
                    $db.courses[$foundIndex] = $updated
                    Save-Database $db
                    & $sendJson @{ success = $true; message = "Course updated successfully"; course = $updated } 200
                } else {
                    & $sendJson @{ success = $false; message = "Course not found" } 404
                }
                continue
            }

            if ($urlPath.StartsWith("/api/admin/courses/") -and $httpMethod -eq "DELETE") {
                $id = $urlPath.Substring(19).Trim()
                $db = Get-Database
                $db.courses = @($db.courses | Where-Object { $_.id -ne $id })
                Save-Database $db
                & $sendJson @{ success = $true; message = "Course deleted successfully" } 200
                continue
            }

            # --- ADMIN: PAYMENTS / FEES ---
            if ($urlPath -eq "/api/admin/payments" -and $httpMethod -eq "GET") {
                $db = Get-Database
                & $sendJson @{ success = $true; payments = $db.payments } 200
                continue
            }

            if ($urlPath -eq "/api/admin/payments" -and $httpMethod -eq "POST") {
                $db = Get-Database
                $payment = $bodyJson
                $rcpNum = $db.payments.Count + 1
                $receiptNo = "RCP-2026-" + (1000 + $rcpNum)
                $payment | Add-Member -MemberType NoteProperty -Name "receiptNo" -Value $receiptNo -Force

                # Update Student paid and pending fees
                $stuId = $payment.studentId
                foreach ($s in $db.students) {
                    if ($s.id -eq $stuId) {
                        $s.paidFees = [int]$s.paidFees + [int]$payment.amount
                        $pend = [int]$s.totalFees - [int]$s.paidFees
                        if ($pend -lt 0) { $pend = 0 }
                        $s.pendingFees = $pend
                        break
                    }
                }

                $pList = [System.Collections.ArrayList]@($db.payments)
                $pList.Add($payment) | Out-Null
                $db.payments = $pList
                Save-Database $db
                & $sendJson @{ success = $true; message = "Payment recorded successfully"; payment = $payment } 201
                continue
            }

            # --- ADMIN: CERTIFICATES ---
            if ($urlPath -eq "/api/admin/certificates" -and $httpMethod -eq "GET") {
                $db = Get-Database
                & $sendJson @{ success = $true; certificates = $db.certificates } 200
                continue
            }

            if ($urlPath -eq "/api/admin/certificates" -and $httpMethod -eq "POST") {
                $db = Get-Database
                $cert = $bodyJson
                if ([string]::IsNullOrWhiteSpace($cert.certificateNo)) {
                    $nextCert = $db.certificates.Count + 1
                    $cert | Add-Member -MemberType NoteProperty -Name "certificateNo" -Value ("PCE-2026-" + (100 + $nextCert)) -Force
                }
                $cert | Add-Member -MemberType NoteProperty -Name "status" -Value "Verified" -Force
                if ([string]::IsNullOrWhiteSpace($cert.authorizedSignatory)) {
                    $cert | Add-Member -MemberType NoteProperty -Name "authorizedSignatory" -Value $db.settings.authorizedPerson -Force
                }

                # Mark student completed
                foreach ($s in $db.students) {
                    if ($s.id -eq $cert.studentId) {
                        $s.status = "Completed"
                        break
                    }
                }

                $certList = [System.Collections.ArrayList]@($db.certificates)
                $certList.Add($cert) | Out-Null
                $db.certificates = $certList
                Save-Database $db
                & $sendJson @{ success = $true; message = "Certificate generated successfully"; certificate = $cert } 201
                continue
            }

            # --- ADMIN: SETTINGS ---
            if ($urlPath -eq "/api/admin/settings" -and $httpMethod -eq "GET") {
                $db = Get-Database
                & $sendJson @{ success = $true; settings = $db.settings } 200
                continue
            }

            if ($urlPath -eq "/api/admin/settings" -and $httpMethod -eq "PUT") {
                $db = Get-Database
                $db.settings = $bodyJson
                Save-Database $db
                & $sendJson @{ success = $true; message = "Settings updated successfully"; settings = $db.settings } 200
                continue
            }

            # --- ADMIN: CHANGE PIN ---
            if ($urlPath -eq "/api/admin/change-pin" -and $httpMethod -eq "POST") {
                $db = Get-Database
                $currPin = $bodyJson.currentPin
                $newPin = $bodyJson.newPin

                if ([string]::IsNullOrWhiteSpace($newPin) -or $newPin.Trim().Length -lt 4) {
                    & $sendJson @{ success = $false; message = "New PIN must be at least 4 characters" } 400
                    continue
                }

                $currHash = Get-Sha256Hash $currPin.Trim()
                if ($currHash -ne $db.adminAuth.pinHash) {
                    & $sendJson @{ success = $false; message = "Current PIN is incorrect" } 400
                    continue
                }

                $db.adminAuth.pinHash = Get-Sha256Hash $newPin.Trim()
                $db.adminAuth.pinHint = "Admin PIN was updated."
                Save-Database $db
                & $sendJson @{ success = $true; message = "Admin PIN changed successfully! Please use your new PIN next time." } 200
                continue
            }

            & $sendJson @{ success = $false; message = "API endpoint not found" } 404
            continue
        }

        # =====================================================================
        # 2. STATIC FILE ROUTING
        # =====================================================================
        # URL Rewrites
        if ($urlPath -eq "/" -or $urlPath -eq "") {
            $urlPath = "/index.html"
        } elseif ($urlPath -eq "/admin" -or $urlPath -eq "/admin/") {
            $urlPath = "/admin.html"
        } elseif ($urlPath -eq "/verify-certificate" -or $urlPath -eq "/verify-certificate/") {
            $urlPath = "/verify.html"
        } elseif ($urlPath -eq "/print-receipt") {
            $urlPath = "/print-receipt.html"
        } elseif ($urlPath -eq "/print-certificate") {
            $urlPath = "/print-certificate.html"
        }

        $decodedPath = [System.Uri]::UnescapeDataString($urlPath.TrimStart('/'))
        $localFilePath = Join-Path $baseDir $decodedPath.Replace('/', '\')

        if (Test-Path $localFilePath -PathType Leaf) {
            $ext = [System.IO.Path]::GetExtension($localFilePath).ToLower()
            $contentType = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }

            $content = [System.IO.File]::ReadAllBytes($localFilePath)
            $response.ContentType = $contentType
            $response.ContentLength64 = $content.Length
            $response.StatusCode = 200
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("<h1>404 Not Found</h1><p>The requested URL was not found on Perfect Computer Education server.</p>")
            $response.ContentType = "text/html; charset=utf-8"
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
        }
        $response.Close()
    }
} finally {
    $listener.Stop()
}
