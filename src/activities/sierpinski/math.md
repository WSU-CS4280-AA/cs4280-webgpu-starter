# Chaos game math for the Sierpinski gasket

## Setup

Take a triangle with corners (the same ones the code uses):

$$
V_0 = (-1, -1), \quad V_1 = (0, 1), \quad V_2 = (1, -1)
$$

and a starting point $P_0 = (0, 0)$.

## The rule

For $i = 0, 1, 2, \dots, n-1$:

1. Pick a corner $V_k$ at random, with $k \in \{0, 1, 2\}$ and each corner equally likely.
2. Move halfway toward it:

$$
P_{i+1} = \frac{P_i + V_k}{2}
$$

3. Plot $P_{i+1}$.

In the code:

```js
const c = corners[Math.floor(Math.random() * 3)];   // pick V_k
p = [(p[0] + c[0]) / 2, (p[1] + c[1]) / 2];          // P = (P + V_k) / 2
```

## Why this produces the gasket

Each choice of corner applies one of three maps:

$$
f_k(P) = \tfrac{1}{2}P + \tfrac{1}{2}V_k, \qquad k = 0, 1, 2
$$

Each $f_k$ shrinks the whole plane by half toward $V_k$. When applied to the triangle:

- $f_0$ gives the half-size copy in the **bottom-left** corner,
- $f_1$ gives the copy at the **top**,
- $f_2$ gives the copy in the **bottom-right** corner.

Together the three copies cover the triangle, except for the upside-down middle triangle, which no map reaches. Apply the maps again and each copy loses its own middle, and so on. The Sierpinski gasket $S$ is the only shape that the three maps rebuild exactly:

$$
S = f_0(S) \cup f_1(S) \cup f_2(S)
$$

A system of shrinking maps like this is called an **Iterated Function System (IFS)**, and $S$ is its **attractor**.

## Why random jumps land on it

- **Convergence:** every map halves distances, so after $m$ steps any error in the starting point has shrunk by $2^{-m}$. Starting from $(0, 0)$, which is not in the gasket, the point is within $2^{-10} \approx 0.001$ of it after about 10 steps. That's less than a pixel, so the first few stray points are invisible.
- **Coverage:** since the corners are chosen at random, every possible sequence of corners eventually happens. After a point lands in the gasket, the next $m$ random choices decide which of the $3^m$ sub-triangles of size $2^{-m}$ it lands in next. Over many points, every sub-triangle gets filled.

## Coordinates

The corners are already in WebGPU clip space ($x, y \in [-1, 1]$), and every point is an average of points inside the triangle, so it stays inside too. That's why the vertex shader can pass each position through unchanged:

$$
\text{clip position} = (x,\ y,\ 0,\ 1)
$$

## Count

The **Count** slider sets $n$, the number of points plotted. The shape itself is fixed by the three maps; a larger $n$ only fills it in more densely.
