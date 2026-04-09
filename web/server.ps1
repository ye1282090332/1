$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add('http://localhost:3003/')
$listener.Start()
Write-Host "Server running at http://localhost:3003/"

while ($listener.IsListening) {
    $context = $listener.GetContext()
    $response = $context.Response
    $url = $context.Request.Url.LocalPath
    
    if ($url -eq '/') { $url = '/index.html' }
    
    $filePath = Join-Path $PSScriptRoot $url.Substring(1)
    
    if (Test-Path $filePath -PathType Leaf) {
        $content = [System.IO.File]::ReadAllBytes($filePath)
        $ext = [System.IO.Path]::GetExtension($filePath)
        
        $mime = @{
            '.html' = 'text/html'
            '.css' = 'text/css'
            '.js' = 'application/javascript'
            '.png' = 'image/png'
            '.jpg' = 'image/jpeg'
            '.gif' = 'image/gif'
            '.svg' = 'image/svg+xml'
        }[$ext]
        
        if (-not $mime) { $mime = 'application/octet-stream' }
        
        $response.ContentType = $mime
        $response.ContentLength64 = $content.Length
        $response.OutputStream.Write($content, 0, $content.Length)
    } else {
        $response.StatusCode = 404
    }
    
    $response.Close()
}
