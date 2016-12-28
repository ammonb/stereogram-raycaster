# Random dot stereogram raycaster

Raycasters and single-image random dot stereograms are are two of my favorite things! Here I've combined them, into a [real-time raycaster]()  with the option to render in random dot stereogram. Let me know what you think!

## Controls

The program initially renders in color. You can change the render mode (to depth map or stereogram) by pressing 1, 2 or 3. In the game, navigate with the arrow keys, and jump with the space bar. If you hold down the 'e' key, you can use the arrow keys to modify the block in front of you.


## Raycasting

Raycasting is an algorithm for rending 3D geometry. It was made famous by Wolfenstein 3D and Doom. The core algorithm is delightfully simple (you can write a working renderer in about 20 lines). It works in a similar fashion to ray tracing, where rays are followed from a camera out into the 3D scene. In a ray tracer, one or more rays is "traced" for every pixel. This produces beautiful renderings, but is computationally expensive. In a ray caster, one ray is "cast" for every column of pixels. This is much faster. As long as the geometry satisfies certain constraints, this is sufficient to produce a rendering. You can read more about the algorithm [here](http://lodev.org/cgtutor/raycasting.html).


## Random dot stereograms

Random dot stereograms are images that provide stereographic depth perception to the brain, without providing any color information. The simplest way do this is to show random dot pattern to one eye, and a modified version of that pattern to the other eye, where the distance between pairs of dots in the two images have been modified to reflect stereographic depth. This works, but requires an optical apparatus (like Google cardboard)to show a different image to each eye. But it ends up that if we truly only care about stereographic depth information, we can achieve this in a single image. The trick is to produce an image with a repetitive base pattern, like a chain-link fence. A viewer can then spread or cross their eyes while viewing this pattern, and trick their brain into thinking that both eyes are focusing on the same pattern when they in fact are not. Algorithmic warping of this repeating pattern can then be used to generate stereographic depth perception. You can read more about this algorithm [here](http://www.cs.waikato.ac.nz/~ihw/papers/94-HWT-SI-IHW-SIRDS-paper.pdf).
