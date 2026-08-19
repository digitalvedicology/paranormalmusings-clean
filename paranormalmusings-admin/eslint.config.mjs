import { dirname } from 'path'
import { fileURLToPath } from 'url'
import { FlatCompat } from '@eslint/eslintrc'

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) })

export default [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      // Thumbnails here are the same remote placeholders the site uses.
      '@next/next/no-img-element': 'off',
      // `const { _id, order, ...post } = doc` is how a stored record is turned
      // back into content. The named keys are meant to be discarded.
      '@typescript-eslint/no-unused-vars': ['warn', { ignoreRestSiblings: true }],
    },
  },
]
