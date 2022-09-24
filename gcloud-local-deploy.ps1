Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"
$PSDefaultParameterValues['*:ErrorAction']='Stop'
function ThrowOnNativeFailure {
    if (-not $?)
    {
        throw 'Native Failure'
    }
}
yarn glogin
ThrowOnNativeFailure
yarn install
ThrowOnNativeFailure
 yarn build
ThrowOnNativeFailure
 npm publish