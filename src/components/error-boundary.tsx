'use client';
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state to render fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    // Log the error to an external service
    console.error('Error occurred:', error, errorInfo);
  }

  render() {
    // if (this.state.hasError) {
    //   // Render fallback UI
    //   // permanentRedirect('/404');
    // }

    return this.props.children;
  }
}

export default ErrorBoundary;
