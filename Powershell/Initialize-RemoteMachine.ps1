function Initialize-RemoteMachine($workingDir) {
    # Robocopy is configured to NOT copy stuff thats already copied, unless its changed
    $robocopy = "$yDir\..\Libs\robocopy\robocopy.exe"
    "Copying YDeliver"
    Trace-Robocopy {
        $source = $yDir
        $destination = "$workingDir\YDeliver"
        &$robocopy $source $destination /v /e /purge /mir
    }
    "Copying BuildLibs"
    Trace-Robocopy {
        $source = "$yDir\..\Libs"
        $destination = "$workingDir\Libs"
        &$robocopy $source $destination /v /e /purge /mir
    }
}