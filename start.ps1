$dockerComposePath = "C:\Users\brand\AppData\Roaming\Docker\cagent\boutique-admin\docker-compose.yml"

# Read the file
$content = Get-Content $dockerComposePath -Raw

# Replace password and user
$content = $content -replace 'POSTGRES_PASSWORD: tEddyFun12', 'POSTGRES_PASSWORD: postgres'
$content = $content -replace 'DB_PASSWORD: tEddyFun12', 'DB_PASSWORD: postgres'
$content = $content -replace 'DB_USER: boutique_user', 'DB_USER: postgres'

# Write back
$content | Set-Content $dockerComposePath

# Stop and remove old containers
cd C:\Users\brand\AppData\Roaming\Docker\cagent\boutique-admin
docker compose down -v

# Start fresh
docker compose up
