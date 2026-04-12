$shell = New-Object -ComObject Shell.Application
$folder = $shell.Namespace('d:\0CODE\AntiGravity\Cours_Memos\Docker\mp3\sfx')
$files = Get-ChildItem -Path 'd:\0CODE\AntiGravity\Cours_Memos\Docker\mp3\sfx' -Filter *.mp3

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

$result | ConvertTo-Json -Depth 2 | Out-File "d:\0CODE\AntiGravity\Cours_Memos\Docker\mp3\sfx_catalog.json" -Encoding utf8
Write-Output "Done! Output written to sfx_catalog.json"
