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
  function mockPlugin(preset: any) {
    const plugin = preset.plugins?.[0]
    if (!plugin?.handler) return {}

    const styles: Record<string, any> = {}
    plugin.handler({
      addBase(baseStyles: Record<string, any>) {
        Object.assign(styles, baseStyles)
      }
    })
    return styles
  }

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

    run({
      presets: [preset],
      content: [
        {
          raw: String.raw`
          <div>
            <p class="text-primary-50"></p>
            <p class="text-primary-100"></P>
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
    const baseStyles = mockPlugin(preset)

    expect(baseStyles[':root']).toMatchObject({
      'color-scheme': 'light',
      '--tw-primary-50': '248 250 252'
    })

    expect(baseStyles['.dark']).toMatchObject({
      'color-scheme': 'dark',
      '--tw-primary-50': '15 23 42'
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
    const baseStyles = mockPlugin(preset)

    expect(baseStyles[':root']).toMatchObject({
      '--custom-primary-50': '248 250 252'
    })

    const colors = preset.theme?.extend?.colors as Record<string, any>
    expect(colors?.primary['50']).toBe('rgba(var(--custom-primary-50) / <alpha-value>)')
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
    const baseStyles = mockPlugin(preset)

    expect(baseStyles[':root']).toMatchObject({
      '--tw-primary-50': '210 40% 98%'
    })

    const colors = preset.theme?.extend?.colors as Record<string, any>
    expect(colors?.primary['50']).toBe('hsla(var(--tw-primary-50) / <alpha-value>)')
  })

  it('should handle single color value', () => {
    const theme: Theme = {
      colors: {
        primary: '#f8fafc'
      }
    }

    const preset = createPreset(theme)
    const baseStyles = mockPlugin(preset)

    expect(baseStyles[':root']).toMatchObject({
      '--tw-primary': '248 250 252'
    })

    const colors = preset.theme?.extend?.colors as Record<string, any>
    expect(colors?.primary).toBe('rgba(var(--tw-primary) / <alpha-value>)')
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
