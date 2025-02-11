// src/components/ui/container.jsx
export function Container({ className, ...props }) {
    return (
      <div
        className={`container mx-auto px-4 max-w-6xl ${className}`}
        {...props}
      />
    )
  }