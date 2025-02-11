/**
 * 代表顏色值的映射,key 為顏色名稱,value 為顏色值
 * 例如: { '50': '#f8fafc', '100': '#f1f5f9' }
 */
export type Colors = Record<string, string>

/**
 * 代表主題顏色的設定
 * 例如: {
 *   colors: {
 *     primary: { '50': '#f8fafc', '100': '#f1f5f9' },
 *     secondary: '#64748b'
 *   }
 * }
 */
export type ThemeColors = {
  colors: Record<string, Colors | string>
}

/**
 * 代表完整的主題設定
 * 可以是單一主題設定,或是包含淺色/深色模式的主題設定
 *
 * 單一主題設定例如:
 * {
 *   colors: {
 *     primary: { '50': '#f8fafc' }
 *   }
 * }
 *
 * 淺色/深色主題設定例如:
 * {
 *   light: {
 *     colors: {
 *       primary: { '50': '#f8fafc' }
 *     }
 *   },
 *   dark: {
 *     colors: {
 *       primary: { '50': '#0f172a' }
 *     }
 *   }
 * }
 */
export type Theme = ThemeColors | Record<'light' | 'dark', ThemeColors>

/**
 * 用於判斷主題是否包含淺色/深色模式設定
 */
export const isThemeWithModes = (theme: Theme): theme is Record<'light' | 'dark', ThemeColors> => {
  return 'light' in theme && 'dark' in theme
}
