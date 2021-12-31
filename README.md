# Circles

Circles is a audio-visual online installation.

## Configuration
Use querystring parameters for different configurations. Possible keys are: scenario, size, color, background, alpha, disableClear, enableClear,  clearWithDelay, vibrationFactor, movementFactor, circles 

Values for scenario: static, duet, walk, big, small, paint, audiotest, red_alpha, red, blue, blue_middle, green, green_red_alpha, blue_red_alpha, yellow. 

Size is in number of pixels.

Color and background are hexadecimal without the # sign. 

The alpha parameter can be just a number for a static alpha value, or 4 values indicating the type of process (only "fade-in" for now), the initial alpha value, the step value and the wait value (in seconds); for example: fade-in,0.005,0.001,0.1. 

The parameters enableClear and disableClear override whether the previous points are cleared or not. No value necessary. 

The parameter delayClear is only useful with enableClear, and allows to clear the previous points with a delay. If no value is passed the default (5 seconds) is used. 

The parameters vibrationFactor and movementFactor influence the speed of vibration and movement: lower values increase the speed, higher values slow it down. 

The circles parameter turns the points into circles. If no value is passed the default size factor (0.95) is used. 

## Keyboard shortcuts:
n: trigger the next scenario 

a: trigger the same scenario again (with possibly other random arguments) 

s: toggle window-size listener 

q: stop playback 

p: start playback
