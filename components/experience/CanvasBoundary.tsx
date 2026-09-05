"use client";
import { Component, type ReactNode } from "react";
import FallbackPoster from "./FallbackPoster";

export default class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err: unknown) { console.error("[canvas]", err); }
  render() { return this.state.failed ? <FallbackPoster /> : this.props.children; }
}
