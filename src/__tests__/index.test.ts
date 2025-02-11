import { describe, it, expect } from 'vitest'
import { createPreset } from '../index'
import type { Theme } from '../types'

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
        }
      }
    }

    const preset = createPreset(theme)
    const baseStyles = mockPlugin(preset)

    expect(preset.theme?.extend?.colors).toMatchObject({
      primary: {
        '50': 'rgba(var(--tw-primary-50) / <alpha-value>)',
        '100': 'rgba(var(--tw-primary-100) / <alpha-value>)'
      }
    })

    expect(baseStyles[':root']).toMatchObject({
      'color-scheme': 'light',
      '--tw-primary-50': '248 250 252',
      '--tw-primary-100': '241 245 249'
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
