function Get-PSCredential($username, $password){
    $securePassword = ConvertTo-SecureString $password -AsPlainText -Force
    New-Object System.Management.Automation.PSCredential ($username, $securePassword)   
}

function Invoke-RemoteDeploy($config) {
   
    "Deploying to $($config.server.name)"
    if($config["credential"]) {
        $credential = Get-PSCredential $config.credential.username $config.credential.password 
        $session = New-PSSession -ComputerName "$($config.server.publicIp)" -authentication Default -credential $credential
    } else {
        $session = New-PSSession -ComputerName "$($config.server.publicIp)" -authentication Default
    }

    try{

        Initialize-RemoteMachine  $config.remoteWorkFolder

        Invoke-Command -Session $session -Command {
            param($config)
            
            # Remote commands go here
            & "$env:systemroot\system32\inetsrv\appcmd" start apppool DefaultAppPool
            return $lastexitcode

        } -ArgumentList @(, $config)

    } finally {
        try {
        Remove-PSSession $session
        }
        catch { }
    }
} 