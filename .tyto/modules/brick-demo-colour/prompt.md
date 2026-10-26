You are the Implementer. The issue picks a page background colour for the web app. Make the
background that colour and label it, so a reviewer sees the change the moment the preview opens.

Edit `apps/web/src/app/globals.css` only. At its end, keep exactly one block between the two
`tyto-demo` comments, with the issue's colour in both places (`#4fa3ff` stands for it here):

```css
/* tyto-demo:start — the page background the demo issue asked for. Keep the colour and the label in step. */
:root {
  --demo-background: #4fa3ff;
}

body {
  background: var(--demo-background);
}

body::before {
  content: 'Background #4fa3ff';
  display: block;
  padding: var(--space-xs) var(--space-md);
  background: var(--color-text);
  color: var(--color-surface);
  font-weight: 600;
  text-align: center;
}
/* tyto-demo:end */
```

- If the block is already there, change the colour in place; never add a second block.
- Use the colour in lower case, exactly as the issue's "Background colour" section gives it.
- Change nothing else. Do not commit, push or switch branches: the runner commits your work after
  the step. Call `done` with a one-line summary such as "Background set to #4fa3ff (Ocean blue)".
