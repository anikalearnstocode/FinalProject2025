# FinalProject2025

My project idea will be an interactive art piece inspired by nature. I want to create a piece where clicking anywhere on the canvas will create expanding ripples that fade out over time, mimicking the natural and smooth motion of water when disturbed. The intent is to provide a calm and visually appealing experience. Ideally, time permitting, I would love to also add a sound element to this art piece that replicates the sound of when a rock is plopped into water. The ripples will be dynamic and will allow overlapping waves to appear on the canvas if the user clicks multiple different points on the screen. 

 

Here are the core components of the art piece:

1. Canvas:

Blue color that shifts in tone and lightness over time to display passage of time or changes in weather/cloud cover.
2. Ripples:

When the user clicks, a new ripple (circle) is created at the click location.
The ripple expands outward while gradually fading in opacity.
The effect is stored in an array so multiple ripples can exist simultaneously.
3. Interaction:

Ripples expand using a simple "radius += speed" update inside the draw loop.
Different ripple sizes based on the speed of the click.
4. Color & Visual Effects:

Ripple colors can be based on a gradient or randomly chosen from a palette.
Pressing a key (e.g., "C") could change the color scheme.
A subtle blur or glow effect can be added to make ripples feel more organic.
