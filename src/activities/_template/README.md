# Activity Template

Copy this folder to create a new in-class activity, e.g.:

```sh
cp -R src/activities/_template src/activities/week03-transforms
```

Then:

1. Rename the component in `index.jsx` and fill in its title/summary.
2. Implement `renderer.js` (see `src/activities/hello-triangle/renderer.js`
   for a fully worked reference of the same shape) and `shaders.wgsl`.
3. Add an entry to `src/content/registry.js` under `routes` (and, if it
   corresponds to a syllabus week, update `schedule`) so it shows up in the
   sidebar and on the home page.
