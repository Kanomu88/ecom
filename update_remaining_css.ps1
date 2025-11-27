$files = @(
    "cart.css",
    "checkout.css",
    "payment.css",
    "order-success.css",
    "login.css",
    "register.css",
    "search.css",
    "order-track.css",
    "admin.css"
)

$cssPath = "d:\Users\user\Desktop\project_website\ecommerce_project\doll-preorder-website\public\css"

$replacements = @{
    '#D4AF37' = 'var(--accent-gold)'
    '#B4941F' = '#D4849C'
    '#C5A028' = '#E89CAD'
    '#E5C86B' = '#F4B4C4'
    '#4CAF50' = 'var(--primary-color)'
    '#388E3C' = 'var(--accent-rose)'
    '#43A047' = '#FFA6B8'
    '#2E7D32' = 'var(--accent-rose)'
    '#45a049' = '#FFA0B5'
    '#FFD700' = 'var(--accent-rose)'
    '#FFA500' = '#FF8FA3'
    'rgba\(212, 175, 55,' = 'rgba(230, 164, 180,'
    'rgba\(76, 175, 80,' = 'rgba(255, 182, 193,'
}

foreach ($fileName in $files) {
    $filePath = Join-Path $cssPath $fileName
    if (Test-Path $filePath) {
        $content = Get-Content $filePath -Raw
        $modified = $false
        
        foreach ($key in $replacements.Keys) {
            if ($content -match [regex]::Escape($key)) {
                $content = $content -replace [regex]::Escape($key), $replacements[$key]
                $modified = $true
            }
        }
        
        if ($modified) {
            Set-Content -Path $filePath -Value $content -NoNewline
            Write-Host "Updated: $fileName"
        }
    }
}
