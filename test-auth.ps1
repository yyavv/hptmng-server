# Test Authentication API

## Test 1: Login with admin user
$headers = @{
    "Content-Type" = "application/json"
}

$body = @{
    username = "admin"
    password = "admin123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Headers $headers -Body $body
Write-Host "`n✅ Login successful!" -ForegroundColor Green
Write-Host "Token: $($response.token.Substring(0, 50))..." -ForegroundColor Cyan
Write-Host "User: $($response.user.full_name) ($($response.user.role))" -ForegroundColor Yellow

# Save token for next tests
$token = $response.token

## Test 2: Access protected route WITH token
Write-Host "`n## Test 2: Access patients with auth token" -ForegroundColor Magenta
$authHeaders = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $patients = Invoke-RestMethod -Uri "http://localhost:3000/api/patients" -Method Get -Headers $authHeaders
    Write-Host "✅ Accessed protected route! Found $($patients.Count) patients" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to access protected route: $_" -ForegroundColor Red
}

## Test 3: Access protected route WITHOUT token
Write-Host "`n## Test 3: Access patients WITHOUT auth token" -ForegroundColor Magenta
try {
    $patients = Invoke-RestMethod -Uri "http://localhost:3000/api/patients" -Method Get
    Write-Host "❌ Should have been blocked!" -ForegroundColor Red
} catch {
    Write-Host "✅ Correctly blocked! Error: $($_.Exception.Message)" -ForegroundColor Green
}

## Test 4: Get all branches (with auth)
Write-Host "`n## Test 4: Get branches with auth" -ForegroundColor Magenta
try {
    $branches = Invoke-RestMethod -Uri "http://localhost:3000/api/branches" -Method Get -Headers $authHeaders
    Write-Host "✅ Accessed branches! Found $($branches.Count) branches" -ForegroundColor Green
    $branches | ForEach-Object {
        Write-Host "  - $($_.branch_name) ($($_.branch_code))" -ForegroundColor Cyan
    }
} catch {
    Write-Host "❌ Failed: $_" -ForegroundColor Red
}

## Test 5: Register new user
Write-Host "`n## Test 5: Register new receptionist" -ForegroundColor Magenta
$registerBody = @{
    username = "receptionist1"
    password = "test123"
    full_name = "Test Receptionist"
    role = "receptionist"
} | ConvertTo-Json

try {
    $newUser = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/register" -Method Post -Headers $headers -Body $registerBody
    Write-Host "✅ User registered successfully!" -ForegroundColor Green
    Write-Host "User: $($newUser.user.full_name) ($($newUser.user.role))" -ForegroundColor Yellow
    Write-Host "Token received for immediate login" -ForegroundColor Cyan
} catch {
    Write-Host "⚠️ User might already exist: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n🎉 All tests completed!" -ForegroundColor Green
