$mongoHome = Join-Path $env:USERPROFILE 'mongodb-portable\MongoDB\Server\9.0\bin\mongod.exe'
$dataPath = Join-Path $env:USERPROFILE 'mongodb-data'
$logPath = Join-Path $dataPath 'mongod.log'

if (-not (Test-Path $mongoHome)) {
  throw "MongoDB portable binaries were not found at $mongoHome."
}
if (Get-Process mongod -ErrorAction SilentlyContinue) {
  Write-Output 'MongoDB is already running on port 27017.'
  exit 0
}
New-Item -ItemType Directory -Force -Path $dataPath | Out-Null
Start-Process -FilePath $mongoHome -ArgumentList "--dbpath $dataPath --bind_ip 127.0.0.1 --port 27017 --logpath $logPath" -WindowStyle Hidden
Write-Output 'MongoDB started at mongodb://127.0.0.1:27017.'
