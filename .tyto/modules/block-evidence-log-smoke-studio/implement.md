When `capture` is available, run the lint command and save its output to a temporary file
inside the workspace. Capture it as `E1`, kind `log`, with a caption describing the lint result.
The default SHA is the already pushed HEAD; the final smoke-evidence action repeats the lint
capture on the delivered code. Remove the temporary log file after capture and before calling `done`. Never capture secrets or env dumps.
