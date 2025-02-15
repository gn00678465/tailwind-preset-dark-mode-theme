# Tailwind Preset Dark Mode Theme

## 專案概述

這是一個 Tailwind CSS preset，專門用於處理主題顏色設定和深色模式支援。它提供了一個簡單且強大的方式來管理顏色系統，支援多種深色模式設定方式。

## 核心需求

1. 主題顏色設定
```typescript
type Colors = Record<string, string>
type ThemeColors = Record<'colors', Record<string, Colors | string>>
type Theme = ThemeColors | Record<'light' | 'dark', ThemeColors>
```

2. 功能需求
- 取得上層 tailwindcss config 的 prefix 與 darkMode 設定
- 需要將顏色設定於 :root 內並設定 color-scheme
- 依據 prefix 和 ThemeColors 層級的 key 並使用 `-` 合併
- 將顏色轉換為 rgb 或 hsl 格式
- 顏色設定於 extends.colors 且格式為 `rgba(var(--<prefix>-primary-50) / <alpha-value>)`
- 預設顏色格式為 rgb
- 加入適當的錯誤驗證與處理
- TypeScript 支援

## 專案目標

1. 提供簡單且直觀的 API 來設定主題顏色
2. 確保與 Tailwind CSS 的完整相容性
3. 支援多種深色模式設定方式
4. 提供完整的類型支援
5. 確保程式碼品質和測試覆蓋率

## 開發原則

1. 遵循 TDD (Test-Driven Development) 開發流程
2. 保持程式碼簡潔和可維護性
3. 提供完整的文件和使用範例
4. 確保錯誤處理和型別安全

## 專案範圍

### 包含
- 主題顏色設定和管理
- 深色模式支援
- 顏色格式轉換
- 錯誤處理
- TypeScript 型別定義
- 測試套件

### 不包含
- UI 元件
- 動態主題切換
- 主題預設值
- 顏色生成工具

## 成功指標

1. 所有測試通過
2. TypeScript 型別完整
3. 支援所有 Tailwind CSS 的深色模式設定
4. 文件完整且易於理解
5. 程式碼品質維持在高水準