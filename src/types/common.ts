import * as React from 'react'

export interface WithChildren {
  children: React.ReactNode;
}

export type ComponentProps<T> = {
  className?: string;
  children?: React.ReactNode;
} & T

export type Component<T = unknown> = (props: ComponentProps<T>) => JSX.Element;