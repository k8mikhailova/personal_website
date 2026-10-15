type ArrowIconProps = {
  direction?: 'right' | 'down' | 'up' | 'up-right'
  className?: string
}

const rotation = { right: 0, down: 90, up: -90, 'up-right': -45 }

export function ArrowIcon({ direction = 'right', className }: ArrowIconProps) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ transform: `rotate(${rotation[direction]}deg)` }}
    >
      <path
        d="M2.5 8h10.5M9 3.75 13.25 8 9 12.25"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
