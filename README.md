# Tailwind Preset Dark Mode Theme

一個用於管理 Tailwind CSS 主題顏色和深色模式的 preset。

## 特點

- 🎨 簡單的主題顏色設定
- 🌓 完整的深色模式支援
- 🎯 自定義選擇器支援
- 🔄 自動的顏色格式轉換
- 📦 零依賴 (除了 colord)
- 💪 完整的 TypeScript 支援

## 安裝

```bash
# 使用 npm
npm install tailwind-preset-dark-mode-theme

# 使用 pnpm
pnpm add tailwind-preset-dark-mode-theme

# 使用 yarn
yarn add tailwind-preset-dark-mode-theme
```

## 使用方式

### 基本使用

```typescript
// tailwind.config.ts
import { createPreset } from 'tailwind-preset-dark-mode-theme'

const theme = {
  colors: {
    primary: {
      '50': '#f8fafc',
      '100': '#f1f5f9'
    }
  }
}

export default {
  content: [],
  presets: [createPreset(theme)]
}
```

### 深色模式支援

```typescript
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
  content: [],
  darkMode: 'selector', // 或 'media'
  presets: [createPreset(theme)]
}
```

### 自定義選擇器

```typescript
const theme = {
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

export default {
  content: [],
  darkMode: 'selector',
  presets: [
    createPreset(theme, {
      darkSelectors: ['.dark-theme', '[data-mode="dark"]']
    })
  ]
}
```

HTML 使用：
```html
<!-- 使用 class -->
<div class="dark-theme">
  <p class="text-primary-50">深色主題</p>
</div>

<!-- 使用 data 屬性 -->
<div data-mode="dark">
  <p class="text-primary-50">深色主題</p>
</div>
```

### 自定義選項

```typescript
createPreset(theme, {
  // CSS 變數前綴
  prefix: 'custom',  // 預設: 'tw'
  
  // 顏色格式
  colorFormat: 'hsl', // 預設: 'rgb'
  
  // 深色模式選擇器
  darkSelectors: ['.dark-theme', '[data-mode="dark"]'] // 預設: ['.dark']
})
```

## API

### Theme 型別

```typescript
type Colors = Record<string, string>
type ThemeColors = Record<'colors', Record<string, Colors | string>>
type Theme = ThemeColors | Record<'light' | 'dark', ThemeColors>
```

### PresetOptions 型別

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
  
  /**
   * 深色模式選擇器
   * @default ['.dark']
   */
  darkSelectors?: string[]
}
```

## 注意事項

1. 顏色值必須是有效的 CSS 顏色格式
2. 深色模式選擇器必須是有效的 CSS 選擇器
3. 使用 `darkSelectors` 時需要設定 `darkMode: 'selector'`

## 開發

```bash
# 安裝依賴
pnpm install

# 運行測試
pnpm test

# 建置
pnpm build
```

## 授權

MIT