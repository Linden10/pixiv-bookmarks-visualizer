import { memo } from 'react'

import Link from 'next/link'

interface Props {
  max: number
  current: number
  link?: boolean
  onChange?(page: number): void
}

interface PageProps {
  startPoint: number
  current: number
  i: number
  onChange(page: number): void
}

const Page = memo<PageProps>(props => {
  const { startPoint, current, i, onChange } = props

  return (
    <div
      className={`cursor-pointer p-1 border rounded-md h-full aspect-square text-center ${
        startPoint + i + 1 === current ? 'text-white-900' : 'text-gray-500'
      }`}
      onClick={() => onChange(startPoint + i + 1)}
    >
      {startPoint + i + 1}
    </div>
  )
})

export const Pagination = memo<Props>(props => {
  const { max, current, link = true, onChange } = props

  const pageLength: number = max > 5 ? 5 : max
  const startPoint: number =
    max > 5
      ? current - 2 < 1
        ? 0
        : current + 2 > max
        ? max - pageLength
        : current - (pageLength - 2)
      : 0

  return (
    <div className="flex justify-center py-8 space-x-6 sm:space-x-8">
      {Array.from({ length: pageLength }, (_, i) => (
        <div
          key={`pagination-${startPoint + i}`}
          className="text-md sm:text-lg"
        >
          {link ? (
            (<Link
              href={startPoint + i === 0 ? '/' : `/${startPoint + i + 1}`}
              aria-label={`${startPoint + i + 1}`}
            >

              <Page
                {...{ startPoint, i, current }}
                onChange={page => (onChange ? onChange(page) : null)}
              />

            </Link>)
          ) : (
            <Page
              {...{ startPoint, i, current }}
              onChange={page => (onChange ? onChange(page) : null)}
            />
          )}
        </div>
      ))}
    </div>
  );
})
