"use client";

import { Component, type ReactNode } from "react";

/**
 * Catches WebGL / renderer initialisation errors and shows a graceful fallback
 * instead of crashing the page (covers ~5% of browsers without WebGL 2).
 */
export class WebGLBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode; fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}
