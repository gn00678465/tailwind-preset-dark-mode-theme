import tailwind from 'tailwindcss'
import type { Config } from 'tailwindcss'
import postcss from 'postcss'
import path from 'node:path'
import { describe, it, expect } from 'vitest'
import { createPreset } from '../index'
import type { Theme } from '../types'

export function run(config: Config, plugin = tailwind) {
  const { currentTestName } = expect.getState()

  config = {
    ...{
      presets: [],
      corePlugins: { preflight: false },
    },
    ...config,
  }

  return postcss(plugin(config)).process(
    ['@tailwind base;', '@tailwind utilities'].join('\n'),
    {
      from: `${path.resolve(__filename)}?test=${currentTestName}`,
    },
  )
}

describe('createPreset', () => {
  it('should handle basic theme colors', () => {
    const theme: Theme = {
      colors: {
        primary: {
          '50': '#f8fafc',
          '100': '#f1f5f9'
        },
        secondary: "#000"
      }
    }

    const preset = createPreset(theme)

    return run({
      presets: [preset],
      content: [
        {
          raw: String.raw`
          <div>
            <p class="text-primary-50"></p>
            <p class="text-primary-100"></p>
            <p class="text-secondary"></p>
          </div>
          `
        }
      ]
    }).then((result) => {
      expect(result.css).toMatchSnapshot()
    })
  })

  it('should handle light/dark theme', () => {
    const theme: Theme = {
      light: {
        colors: {
          primary: {
            '50': '#f8fafc'
          }
        }
      },
      dark: {
        colors: {
          primary: {
            '50': '#0f172a'
          }
        }
      }
    }

    const preset = createPreset(theme)

    return run({
      darkMode: 'class',
      presets: [preset],
      content: [
        {
          raw: String.raw`
          <div>
            <p class="text-primary-50 dark:text-primary-50"></p>
          </div>
          `
        }
      ]
    }).then((result) => {
      expect(result.css).toMatchSnapshot()
    })
  })

  it('should handle custom prefix', () => {
    const theme: Theme = {
      colors: {
        primary: {
          '50': '#f8fafc'
        }
      }
    }

    const preset = createPreset(theme, { prefix: 'custom' })

    return run({
      presets: [preset],
      content: [
        {
          raw: String.raw`
          <div>
            <p class="text-primary-50"></p>
          </div>
          `
        }
      ]
    }).then((result) => {
      expect(result.css).toMatchSnapshot()
    })
  })

  it('should handle HSL color format', () => {
    const theme: Theme = {
      colors: {
        primary: {
          '50': 'hsl(210, 40%, 98%)'
        }
      }
    }

    const preset = createPreset(theme, { colorFormat: 'hsl' })

    return run({
      presets: [preset],
      content: [
        {
          raw: String.raw`
          <div>
            <p class="text-primary-50"></p>
          </div>
          `
        }
      ]
    }).then((result) => {
      expect(result.css).toMatchSnapshot()
    })
  })

  it('should handle single color value', () => {
    const theme: Theme = {
      colors: {
        primary: '#f8fafc'
      }
    }

    const preset = createPreset(theme)

    return run({
      presets: [preset],
      content: [
        {
          raw: String.raw`
          <div>
            <p class="text-primary"></p>
          </div>
          `
        }
      ]
    }).then((result) => {
      expect(result.css).toMatchSnapshot()
    })
  })

  it('should throw error for invalid color', () => {
    const theme: Theme = {
      colors: {
        primary: {
          '50': 'invalid-color'
        }
      }
    }

    expect(() => createPreset(theme)).toThrow('無效的顏色值')
  })
})
