$projectPath = (Resolve-Path (Join-Path $PSScriptRoot '..')).Path
$escapedPath = [regex]::Escape($projectPath)
$processes = Get-CimInstance Win32_Process -Filter "Name='node.exe'" | Where-Object {
  $_.CommandLine -match $escapedPath -and $_.CommandLine -match 'concurrently|nodemon|vite|server[\\/]index\.js'
}

if ($processes) {
  $processes | ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
  Write-Output 'Stopped existing QuizForge development processes.'
} else {
  Write-Output 'No existing QuizForge development processes found.'
}
