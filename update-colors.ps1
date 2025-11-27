# Script to update all CSS files to pink theme
$cssPath = "d:\Users\user\Desktop\project_website\ecommerce_project\doll-preorder-website\public\css"
$files = Get-ChildItem -Path $cssPath -Filter "*.css"

$replacements = @{
    '#D4AF37' = '#E6A4B4'  # Gold to Rose Gold
    '#B4941F' = '#D4849C'  # Dark Gold to Dark Pink
    '#C5A028' = '#E89CAD'  # Medium Gold to Medium Pink
    '#E5C86B' = '#F4B4C4'  # Light Gold to Light Pink
    '#4CAF50' = '#FFB6C1'  # Green to Light Pink
    '#388E3C' = '#FF8FA3'  # Dark Green to Pink
    '#43A047' = '#FFA6B8'  # Medium Green to Medium Pink
    '#2E7D32' = '#FF7A9C'  # Darker Green to Darker Pink
    '#45a049' = '#FFA0B5'  # Green variant to Pink variant
    '#FFD700' = '#FFB6C1'  # Gold to Pink
    '#FFA500' = '#FF8FA3'  # Orange to Pink
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $modified = $false
    
    foreach ($old in $replacements.Keys) {
        if ($content -match $old) {
            $content = $content -replace $old, $replacements[$old]
            $modified = $true
        }
    }
    
    if ($modified) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "Updated: $($file.Name)"
    }
}

Write-Host "Color theme update complete!"
