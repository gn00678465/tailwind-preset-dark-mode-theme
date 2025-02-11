# Tailwind Preset Dark Mode Theme

一個用於 Tailwind CSS 的 preset,提供簡單且強大的主題顏色管理功能,支援淺色/深色模式。

## 特點

- 🎨 支援單一主題或淺色/深色主題設定
- 🔄 自動將顏色轉換為 CSS 變數
- 🌓 自動處理 color-scheme
- 🎯 支援 RGB 和 HSL 顏色格式
- 🔧 支援自定義 prefix

## 安裝

```bash
# npm
npm install tailwind-preset-dark-mode-theme

# pnpm
pnpm add tailwind-preset-dark-mode-theme

# yarn
yarn add tailwind-preset-dark-mode-theme
```

## 使用方法

### 基本使用

```typescript
// tailwind.config.ts
import { createPreset } from 'tailwind-preset-dark-mode-theme'

const theme = {
  colors: {
    primary: {
      '50': '#f8fafc',
      '100': '#f1f5f9',
      '200': '#e2e8f0'
    },
    secondary: '#64748b'
  }
}

export default {
  presets: [
    createPreset(theme)
  ]
}
```

### 淺色/深色主題

```typescript
// tailwind.config.ts
import { createPreset } from 'tailwind-preset-dark-mode-theme'

const theme = {
  light: {
    colors: {
      primary: {
        '50': '#f8fafc',
        '100': '#f1f5f9'
      }
    }
  },
  dark: {
    colors: {
      primary: {
        '50': '#0f172a',
        '100': '#1e293b'
      }
    }
  }
}

export default {
  darkMode: 'class', // 或 'media'
  presets: [
    createPreset(theme)
  ]
}
```

### 自定義選項

```typescript
// tailwind.config.ts
import { createPreset } from 'tailwind-preset-dark-mode-theme'

const preset = createPreset(theme, {
  // 自定義 CSS 變數前綴
  prefix: 'custom', // 預設: 'tw'
  
  // 顏色格式
  colorFormat: 'hsl' // 預設: 'rgb'
})
```

## 配置選項

### Theme 類型

```typescript
// 顏色值的映射
type Colors = Record<string, string>

// 主題顏色設定
type ThemeColors = {
  colors: Record<string, Colors | string>
}

// 完整主題設定
type Theme = ThemeColors | Record<'light' | 'dark', ThemeColors>
```

### PresetOptions 類型

```typescript
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
}
```

## 輸出結果

### CSS 變數

```css
:root {
  color-scheme: light;
  --tw-primary-50: 248 250 252;
  --tw-primary-100: 241 245 249;
}

.dark {
  color-scheme: dark;
  --tw-primary-50: 15 23 42;
  --tw-primary-100: 30 41 59;
}
```

### Tailwind 顏色設定

```javascript
{
  theme: {
    extend: {
      colors: {
        primary: {
          '50': 'rgba(var(--tw-primary-50) / <alpha-value>)',
          '100': 'rgba(var(--tw-primary-100) / <alpha-value>)'
        }
      }
    }
  }
}
```

## 注意事項

1. 確保你的 Tailwind CSS 版本 >= 3.4.0
2. 使用深色模式時,請確保在 tailwind.config.ts 中正確設定 `darkMode` 選項
3. 顏色值必須是有效的 CSS 顏色格式(HEX、RGB、HSL 等)

## License

ISC