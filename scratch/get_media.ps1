# Hub Hylst (bruitages mp3/sfx), deduit de l'emplacement du script ; surchargeable par -Hub ou HYLST_HUB
param([string]$Hub = $(if ($env:HYLST_HUB) { $env:HYLST_HUB } else { Join-Path $PSScriptRoot '..\..\..\..\hylst.fr.platforms\it.hylst.fr' }))
$sfx = (Resolve-Path -LiteralPath (Join-Path $Hub 'mp3\sfx') -ErrorAction Stop).Path

$shell = New-Object -ComObject Shell.Application
$folder = $shell.Namespace($sfx)
$files = Get-ChildItem -Path $sfx -Filter *.mp3

$result = @()
foreach ($file in $files) {
    $item = $folder.ParseName($file.Name)
    $duration = $folder.GetDetailsOf($item, 27) # 27 is usually the duration column in Windows Explorer

    # Generate a simple French name attempt by replacing hyphens and translating basic words
    $cleanName = $file.Name -replace '.mp3', '' -replace '-', ' ' -replace '_', ' '

    $result += [PSCustomObject]@{
        filename = $file.Name
        frenchName = $cleanName
        sizeBytes = $file.Length
        duration = $duration
    }
}

$result | ConvertTo-Json -Depth 2 | Out-File (Join-Path (Split-Path -Parent $sfx) 'sfx_catalog.json') -Encoding utf8
Write-Output "Done! Output written to sfx_catalog.json"
