# CGRA

Project partner:
[Filipe Reis](https://github.com/FilipePintoReis)

## proj

CGRA 2018 car + crane project in WebGL.

Things that may interest you:

#### proj/build/

Contains WebCGF implementations of multiple planar, spacial and surface object primitives (from polygons to cones to cut cones to generic surface abstractions).

All these are optimized for readability, and follow the same pattern.

All objects provide a way to bind a texture/material combo to them through bindTexture().

The most interesting objects:

uvSurface is a surface classically parametrized by a function f taking a 2-tuple (u,v) and returning a point (x,y,z), and is very similar to the WebCGF provided CGFnurbsSurface - with some bonuses like the coords map function. The implementation is obviously very technical, based on techniques from AMAT/CMAT including vector calculus and surface normal computation. This is the most used and the most general surface, used extensively to design the car.

revSurface is a revolution surface, parametrized by a function f taking a 2-tuple (r,theta) and returning a point (x,y,z). You'd use this surface to draw, say, a vase or a cylinder.

ySurface (and friends) is a surface parametrized by a function f
taking a 2-tuple (x,z), which are two coordinates of a point P, and returning
the third coordinate y of P. You'd use this surface to represent, say, a landscape.

tPolygon is -not- a polygon, but rather a planar object whose border is parametrized by a function f taking a real argument t
and a range [a,b] and returning a point (x,y,z) for every t in the range, so that the border is drawn by having t vary in the given range. Having f(a)=f(b) is preferable, but not required. You'd use this surface to draw a heart or a butterfly.

rPolygon is -not- a polygon, but rather a planar object whose border is parametrized by a revolution function f taking an angle theta and a range [a,b] and returning a real value r which is the radius of the revolution at that angle. The border of the polygon is drawn by having theta vary along the given range. Having f(a)=f(b) is again preferable. You'd use this surface to draw a trifolium or a flower.

#### proj/complex/MyVehicle.js

Contains the movement and physics logic for the car animation, mostly in the function update(). Most of the physics parameters can be edited directly through the GUI in real time.

#### Car design

[Desmos Graph](https://www.desmos.com/calculator/viw8trbzfe)
