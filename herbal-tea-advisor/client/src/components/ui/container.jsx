// src/components/ui/container.jsx
export function Container({ className, ...props }) {
    return (
      <div
        className={`w-full max-w-7xl mx-auto px-4 flex flex-col items-center ${className}`}
        {...props}
      />
    )
  }