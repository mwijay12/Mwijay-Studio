import { useEffect, useState } from 'react';

type Listener = (x: number, y: number) => void;

/**
 * One shared pointer tracker for the whole app.
 *
 * Every eye button used to attach its own `pointermove` handler, and each only
 * fired while the cursor was physically over that button — which is why the
 * eyes looked dead until you hovered them. This module keeps a single global
 * listener and fans the coordinates out to every subscriber, so eyes track the
 * cursor from anywhere on the page.
 */
const listeners = new Set<Listener>();
let bound = false;
let lastX = 0;
let lastY = 0;

function handleMove(e: PointerEvent) {
  lastX = e.clientX;
  lastY = e.clientY;
  listeners.forEach((fn) => fn(lastX, lastY));
}

function bind() {
  if (bound || typeof window === 'undefined') return;
  window.addEventListener('pointermove', handleMove, { passive: true });
  bound = true;
}

function unbind() {
  if (!bound || listeners.size > 0) return;
  window.removeEventListener('pointermove', handleMove);
  bound = false;
}

export function subscribePointer(fn: Listener) {
  listeners.add(fn);
  bind();
  // Replay the last known position so a newly mounted element isn't stuck
  // at the origin until the user happens to move the mouse again.
  if (lastX || lastY) fn(lastX, lastY);
  return () => {
    listeners.delete(fn);
    unbind();
  };
}

/** True on devices without a real hover-capable pointer (phones, tablets). */
export function useHasPointer() {
  const [hasPointer, setHasPointer] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setHasPointer(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setHasPointer(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return hasPointer;
}
