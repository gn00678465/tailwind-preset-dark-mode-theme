# 系統模式

## 架構概覽

```mermaid
flowchart TD
    Input[主題設定] --> Processor[處理器]
    Processor --> Output[輸出]
    
    subgraph Processor[處理器]
        Convert[顏色轉換] --> Variables[CSS 變數生成]
        Variables --> Styles[樣式生成]
    end
    
    subgraph Input[輸入]
        Theme[Theme 物件] --> Validate[驗證]
        Config[設定選項] --> Validate
    end
    
    subgraph Output[輸出]
        CSS[CSS 變數] --> Tailwind[Tailwind Preset]
        Styles --> Tailwind
    end
```

## 核心模式

### 1. 主題處理模式

```mermaid
flowchart LR
    Theme[Theme] --> Split[主題分離]
    Split --> Light[淺色主題]
    Split --> Dark[深色主題]
    Light --> Process[顏色處理]
    Dark --> Process
    Process --> Variables[CSS 變數]
```

- 支援單一主題或淺色/深色主題
- 自動分離主題設定
- 統一的處理流程

### 2. 顏色處理模式

```mermaid
flowchart TD
    Color[顏色值] --> Validate[驗證]
    Validate --> Convert[轉換]
    Convert --> RGB[RGB 格式]
    Convert --> HSL[HSL 格式]
```

- 顏色格式驗證
- 格式轉換
- 錯誤處理

### 3. CSS 變數生成模式

```mermaid
flowchart TD
    Vars[CSS 變數] --> Root[:root]
    Vars --> Dark[深色模式]
    Dark --> Selector[.dark]
    Dark --> Media[@media]
```

- 變數命名規範
- 選擇器優先級
- 深色模式支援

## 設計模式

### 1. Factory Pattern
用於創建 Tailwind preset：
```typescript
function createPreset(theme: Theme, options?: PresetOptions): Config
```

### 2. Strategy Pattern
用於處理不同的顏色格式：
```typescript
function convertColor(color: string, format: 'rgb' | 'hsl'): string
```

### 3. Builder Pattern
用於構建 CSS 變數和樣式：
```typescript
function processThemeColors(
  themeColors: ThemeColors,
  prefix: string,
  format: 'rgb' | 'hsl'
): { cssVars: Record<string, string>, colors: Record<string, any> }
```

## 錯誤處理模式

```mermaid
flowchart TD
    Input[輸入] --> Validate[驗證]
    Validate --> Valid{是否有效?}
    Valid -->|是| Process[處理]
    Valid -->|否| Error[拋出錯誤]
    Process --> Output[輸出]
```

### 驗證層級
1. 主題結構驗證
2. 顏色值驗證
3. 選項驗證

### 錯誤類型
1. 無效的顏色值
2. 無效的主題結構
3. 無效的選項值

## 測試模式

```mermaid
flowchart TD
    Test[測試案例] --> Unit[單元測試]
    Test --> Integration[整合測試]
    Unit --> Assert[斷言]
    Integration --> Snapshot[快照測試]
```

### 測試範圍
1. 基本功能測試
2. 深色模式測試
3. 錯誤處理測試
4. 快照測試

## 擴展模式

```mermaid
flowchart TD
    Core[核心功能] --> Extend[擴展點]
    Extend --> Format[新格式]
    Extend --> Mode[新模式]
    Extend --> Feature[新功能]
```

### 擴展點
1. 顏色格式轉換
2. 深色模式處理
3. CSS 變數生成
4. 樣式生成