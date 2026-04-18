---
name: framer-motion
description: "Production-grade animation patterns for React and Next.js using Motion (formerly Framer Motion). Use this skill whenever the user asks to animate components, add transitions, create scroll-triggered effects, implement page transitions, layout animations, gesture interactions, or any kind of motion/animation in a React or Next.js project. Also trigger when code imports 'framer-motion', 'motion/react', or 'motion/react-client', or when the user mentions: animation, transition, fade-in, slide, parallax, scroll animation, exit animation, AnimatePresence, motion.div, spring, gesture, drag, hover animation, stagger, whileInView, or layout animation."
---

# Motion (Framer Motion) — Animation Skill

Production-grade animation patterns for React and Next.js. This skill helps you write correct, performant, accessible animations using the Motion library (v12+).

## Imports

Motion rebranded from `framer-motion` to `motion`. Both package names work, but the import path matters:

```tsx
// Client Components (standard React)
import { motion, AnimatePresence } from "motion/react"

// Next.js Server Components — use the client export
import * as motion from "motion/react-client"

// Legacy import (still works with the framer-motion package)
import { motion } from "framer-motion"
```

If the project already uses `framer-motion` as a dependency, keep using `"framer-motion"` imports for consistency. Don't mix import sources.

## Core Concepts

### motion.* Components

Every HTML/SVG element has a `motion` counterpart. These accept animation props:

```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
/>
```

**Important:** `motion.*` components are client components. In Next.js App Router, either mark the file `"use client"` or wrap them in a client component.

### MotionValues — Animate Without Re-renders

`useMotionValue` creates values that update without triggering React re-renders. This is the key to 60fps animations:

```tsx
const x = useMotionValue(0)
const opacity = useTransform(x, [-200, 0, 200], [0, 1, 0])

return <motion.div style={{ x, opacity }} drag="x" />
```

Rules:
- Use `useMotionValue` for any value that changes every frame (scroll position, drag position, continuous animation)
- Use `useTransform` to derive values from other MotionValues (no re-renders)
- Never use `useState` for frame-by-frame updates — it causes re-renders on every frame

### Transitions

Control how animations move between states:

```tsx
// Spring (default for physical properties like x, y, scale)
transition={{ type: "spring", stiffness: 300, damping: 30 }}

// Tween (default for non-physical properties like opacity, color)
transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}

// Custom cubic bezier
transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
```

## Common Patterns

### Scroll-Triggered Fade-In

The most common animation pattern. Use `whileInView` — do NOT manually use IntersectionObserver:

```tsx
<motion.div
  initial={{ opacity: 0, y: 24 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true, amount: 0.1 }}
  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
>
  {children}
</motion.div>
```

- `viewport.once: true` — only animate on first entry (standard for marketing pages)
- `viewport.amount` — how much of the element must be visible (0.1 = 10%)
- `viewport.margin` — extend the trigger area (e.g., `"0px 0px 50px 0px"`)

### Staggered Children

Animate children one after another using `variants`:

```tsx
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

<motion.ul variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}>
  {items.map((i) => (
    <motion.li key={i} variants={item}>{i}</motion.li>
  ))}
</motion.ul>
```

Variants propagate — parent state changes flow to children automatically.

### Exit Animations with AnimatePresence

Wrap conditionally rendered elements to animate them out before removal:

```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      key="modal"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    />
  )}
</AnimatePresence>
```

Rules:
- Children must have a unique `key`
- `exit` prop defines the exit animation
- Use `mode="wait"` to finish exit before entering next element
- Use `mode="popLayout"` for layout-aware transitions

### Scroll-Linked Animations

Tie animation directly to scroll position:

```tsx
const { scrollYProgress } = useScroll()
const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8])

return <motion.div style={{ opacity, scale }} />
```

For element-specific scroll tracking:

```tsx
const ref = useRef(null)
const { scrollYProgress } = useScroll({
  target: ref,
  offset: ["start end", "end start"], // when element enters/exits viewport
})
```

### Smooth Spring Values

Use `useSpring` for buttery-smooth transitions of MotionValues:

```tsx
const scrollY = useMotionValue(0)
const smoothY = useSpring(scrollY, { stiffness: 100, damping: 30 })
```

### Continuous Animation (useAnimationFrame)

For animations that run every frame (gradient shimmer, counting, etc.):

```tsx
const progress = useMotionValue(0)

useAnimationFrame((time, delta) => {
  const newValue = (time / 1000) % 100
  progress.set(newValue)
})

const backgroundPosition = useTransform(progress, (p) => `${p}% 50%`)

return <motion.span style={{ backgroundPosition }} />
```

### Layout Animations

Animate layout changes automatically:

```tsx
// Simple layout animation
<motion.div layout />

// Shared layout animation between components
<motion.div layoutId="hero-image" />
```

When the same `layoutId` exists in two different components, Motion animates between them (e.g., thumbnail to full-screen).

### Gesture Animations

```tsx
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.97 }}
  whileFocus={{ outline: "2px solid #5227FF" }}
  transition={{ type: "spring", stiffness: 400, damping: 17 }}
/>
```

### Drag

```tsx
<motion.div
  drag           // enable both axes
  drag="x"       // constrain to x-axis
  dragConstraints={{ left: -100, right: 100 }}
  dragElastic={0.2}
  onDragEnd={(e, info) => {
    if (info.offset.x > 100) handleSwipeRight()
  }}
/>
```

## Accessibility

### useReducedMotion

Always respect the user's motion preferences. This is not optional — it's an accessibility requirement:

```tsx
import { useReducedMotion } from "framer-motion"

function AnimatedComponent({ children }) {
  const prefersReducedMotion = useReducedMotion()

  if (prefersReducedMotion) {
    return <div>{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      {children}
    </motion.div>
  )
}
```

Pattern: Check `useReducedMotion()` and either skip animation entirely or reduce it to opacity-only (no movement).

## Performance Rules

1. **Never animate `width`, `height`, `top`, `left`** — these trigger layout recalculation. Use `transform` properties instead (`x`, `y`, `scale`, `rotate`).

2. **Use MotionValues for frame-by-frame updates** — `useState` causes re-renders on every frame. MotionValues update the DOM directly.

3. **`will-change: transform`** is added automatically by motion components — don't add it manually.

4. **`layout` animations are expensive** — use them intentionally, not on every element.

5. **Avoid animating `box-shadow`** — use `filter: drop-shadow()` or animate opacity of a pseudo-element shadow instead.

6. **Prefer `opacity` and `transform`** — these are GPU-composited and run on a separate thread.

7. **Spring transitions are more natural** than tween/easing for interactive elements (hover, tap, drag). Reserve tween for scroll-triggered entrances.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| `useState` for drag position | `useMotionValue` |
| Manual `IntersectionObserver` | `whileInView` prop |
| `setTimeout` for stagger | `variants` with `staggerChildren` |
| Missing `key` in `AnimatePresence` | Add unique `key` to children |
| Animating in Server Components | Add `"use client"` or use `motion/react-client` |
| Ignoring reduced motion | Always check `useReducedMotion()` |
| `animate` on mount without `initial` | Set `initial` to define start state |

## Recipes

### Progress Bar on Scroll

```tsx
const { scrollYProgress } = useScroll()
return (
  <motion.div
    className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
    style={{ scaleX: scrollYProgress }}
  />
)
```

### Animated Counter

```tsx
const count = useMotionValue(0)
const rounded = useTransform(count, (v) => Math.round(v))

useEffect(() => {
  const controls = animate(count, target, { duration: 2 })
  return controls.stop
}, [target])

return <motion.span>{rounded}</motion.span>
```

### Page Transition (Next.js App Router)

```tsx
// template.tsx
"use client"
import { motion } from "framer-motion"

export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}
```

### Animated Gradient Text (Shimmer Effect)

```tsx
const progress = useMotionValue(0)

useAnimationFrame((time) => {
  const duration = 8000
  const fullCycle = duration * 2
  const cycleTime = (time % fullCycle)
  if (cycleTime < duration) {
    progress.set((cycleTime / duration) * 100)
  } else {
    progress.set(100 - ((cycleTime - duration) / duration) * 100)
  }
})

const backgroundPosition = useTransform(progress, (p) => `${p}% 50%`)

return (
  <motion.span
    className="bg-clip-text text-transparent"
    style={{
      backgroundImage: "linear-gradient(to right, #5227FF, #a78bfa, #c084fc, #5227FF)",
      backgroundSize: "300% 100%",
      backgroundPosition,
    }}
  >
    {text}
  </motion.span>
)
```
