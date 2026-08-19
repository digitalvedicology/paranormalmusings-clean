import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) })

export default [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // The design leans on plain <img> for filtered/zoomed art directed art;
      // next/image would fight the .zoom-wrap transforms and the onError fallback.
      '@next/next/no-img-element': 'off',
    },
  },
]
