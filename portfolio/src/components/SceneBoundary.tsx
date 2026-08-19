import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  fallback: ReactNode
}

type State = {
  failed: boolean
}

/**
 * Isolates the WebGL layer.
 *
 * The 3D scene is lazy-loaded and previously had no boundary above it, so a
 * device with WebGL blocked or a lost context would throw past the null
 * Suspense fallback and take the entire page down with it. Here that failure
 * degrades to the static starfield instead.
 */
export default class SceneBoundary extends Component<Props, State> {
  state: State = { failed: false }

  static getDerivedStateFromError(): State {
    return { failed: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn('3D scene failed, falling back to static background:', error, info.componentStack)
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
