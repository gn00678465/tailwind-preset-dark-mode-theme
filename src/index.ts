import { colord } from 'colord'
import type { Theme, ThemeColors } from './types'
import { isThemeWithModes } from './types'
import type { Config } from 'tailwindcss'
import plugin from 'tailwindcss/plugin'

interface PresetOptions {
  /**
   * CSS 變數的前綴
   * @default 'tw'
   */
  prefix?: string
  /**
   * 顏色格式
   * @default 'rgb'
   */
  colorFormat?: 'rgb' | 'hsl'
  /**
   * 深色模式選擇器
   * @default ['.dark']
   * @example ['.dark-theme', '[data-mode="dark"]']
   */
  darkSelectors?: string[]
}

/**
 * 將顏色值轉換為 RGB 或 HSL 格式
 */
function convertColor(color: string, format: 'rgb' | 'hsl' = 'rgb'): string {
  const c = colord(color)
  if (!c.isValid()) {
    throw new Error('無效的顏色值')
  }

  if (format === 'hsl') {
    const { h, s, l } = c.toHsl()
    return `${Math.round(h)} ${Math.round(s)}% ${Math.round(l)}%`
  }

  const { r, g, b } = c.toRgb()
  return `${r} ${g} ${b}`
}

/**
 * 處理單一主題的顏色設定
 */
function processThemeColors(
  themeColors: ThemeColors,
  prefix: string,
  format: 'rgb' | 'hsl' = 'rgb'
): { cssVars: Record<string, string>, colors: Record<string, any> } {
  const cssVars: Record<string, string> = {}
  const colors: Record<string, any> = {}

  Object.entries(themeColors.colors).forEach(([key, value]) => {
    if (typeof value === 'string') {
      // 處理單一顏色值
      const colorValue = convertColor(value, format)
      cssVars[`--${prefix}-${key}`] = colorValue
      colors[key] = `${format}a(var(--${prefix}-${key}) / <alpha-value>)`
    } else {
      // 處理顏色物件
      colors[key] = {}
      Object.entries(value).forEach(([shade, color]) => {
        const colorValue = convertColor(color, format)
        cssVars[`--${prefix}-${key}-${shade}`] = colorValue
        colors[key][shade] = `${format}a(var(--${prefix}-${key}-${shade}) / <alpha-value>)`
      })
    }
  })

  return { cssVars, colors }
}

/**
 * 根據 darkMode 設定生成選擇器
 */
function getDarkModeSelectors(
  darkMode: string | undefined,
  customSelectors?: string[]
): {
  lightSelectors: string[]
  darkSelectors: string[]
  mediaQuery?: string
} {
  // 預設使用 :root 選擇器
  const lightSelectors = [':root']

  if (!darkMode) {
    return { lightSelectors, darkSelectors: [] }
  }

  if (darkMode === 'selector') {
    return {
      lightSelectors,
      // 如果有自定義選擇器則使用自定義選擇器,否則使用預設的 .dark
      darkSelectors: customSelectors?.length ? customSelectors : ['.dark']
    }
  }

  if (darkMode === 'media') {
    return {
      lightSelectors,
      darkSelectors: [':root'],
      mediaQuery: '@media (prefers-color-scheme: dark)'
    }
  }

  // 如果是其他設定,則只使用淺色主題
  return { lightSelectors, darkSelectors: [] }
}

/**
 * 建立 Tailwind CSS preset
 */
export function createPreset(theme: Theme, options: PresetOptions = {}): Config {
  const {
    prefix = 'tw',
    colorFormat = 'rgb',
    darkSelectors: customDarkSelectors
  } = options

  let lightTheme: ThemeColors
  let darkTheme: ThemeColors | undefined

  if (isThemeWithModes(theme)) {
    lightTheme = theme.light
    darkTheme = theme.dark
  } else {
    lightTheme = theme
  }

  const { cssVars: lightVars, colors } = processThemeColors(lightTheme, prefix, colorFormat)
  const { cssVars: darkVars } = darkTheme
    ? processThemeColors(darkTheme, prefix, colorFormat)
    : { cssVars: {} }

  return {
    content: [],
    theme: {
      extend: {
        colors
      }
    },
    plugins: [
      plugin(({ addBase, config }) => {
        const darkMode = config('darkMode', 'media') as string | undefined
        const { lightSelectors, darkSelectors, mediaQuery } = getDarkModeSelectors(darkMode, customDarkSelectors)

        // 設定淺色主題變數
        const styles: Record<string, any> = {
          [lightSelectors.join(', ')]: {
            'color-scheme': 'light',
            ...lightVars
          }
        }

        // 如果有深色主題,則設定深色主題變數
        if (Object.keys(darkVars).length > 0) {
          if (mediaQuery) {
            // 使用 media query
            styles[mediaQuery] = {
              [darkSelectors.join(', ')]: {
                'color-scheme': 'dark',
                ...darkVars
              }
            }
          } else if (darkSelectors.length > 0) {
            // 使用選擇器
            styles[darkSelectors.join(', ')] = {
              'color-scheme': 'dark',
              ...darkVars
            }
          }
        }

        addBase(styles)
      })
    ]
  }
}
