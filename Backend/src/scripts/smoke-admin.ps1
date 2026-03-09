$ErrorActionPreference = 'Stop'

$loginBody = @{ username = 'admin'; password = 'admin123' } | ConvertTo-Json
$login = Invoke-RestMethod -Method Post -Uri 'http://localhost:5000/api/auth/login' -ContentType 'application/json' -Body $loginBody

if (-not $login.token) {
  throw 'Login did not return token'
}

$token = $login.token
Write-Host ('Token acquired: ' + $token.Substring(0, [Math]::Min(16, $token.Length)) + '...')

$users = Invoke-RestMethod -Method Get -Uri 'http://localhost:5000/api/admin/users' -Headers @{ Authorization = ('Bearer ' + $token) }
$users | ConvertTo-Json -Depth 6
