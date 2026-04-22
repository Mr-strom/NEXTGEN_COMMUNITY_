import React from "react";

export class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("App error:", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            padding: 24,
            margin: 24,
            background: "#fee",
            border: "2px solid #c00",
            borderRadius: 8,
            fontFamily: "system-ui, sans-serif",
            color: "#000",
          }}
        >
          <h1 style={{ margin: "0 0 12px 0", fontSize: 18 }}>Something went wrong</h1>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", fontSize: 14 }}>
            {this.state.error?.message ?? String(this.state.error)}
          </pre>
          <p style={{ margin: "12px 0 0 0", fontSize: 12, color: "#666" }}>
            Check the browser console for details. Install missing deps with: npm install zustand lucide-react
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
