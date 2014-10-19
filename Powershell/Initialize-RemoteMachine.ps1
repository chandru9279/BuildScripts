function Initialize-RemoteMachine($workingDir) {
    
    $rootDir = "..\"
    $robocopy = "$rootDir\Libs\robocopy\robocopy.exe"
    "Copying BuildScripts"
    Trace-Robocopy {
        $source = $rootDir
        $destination = "$workingDir\BuildScripts"
        &$robocopy $source $destination /v /e /purge /mir # Robocopy is configured to NOT copy stuff thats already copied, unless its changed
    }
      
}