# 部署指南 (Deployment Guide)

您的網站目前採用 **Supabase** 作為後台資料庫。
為了讓網站順利運作，請依照以下步驟操作：

## 1. 上傳程式碼到 GitHub
請將此資料夾中的所有檔案（除了 `node_modules` 與 `dist`）上傳並覆蓋您 GitHub 儲存庫中的舊檔案。

## 2. 設定 Vercel 環境變數 (Environment Variables)
這是最重要的一步！請登入 Vercel 後台填入您的 Supabase 金鑰。

1. 登入 [Vercel Dashboard](https://vercel.com/dashboard)。
2. 點選您的專案 (Project)。
3. 進入 **Settings** (設定) > **Environment Variables** (環境變數)。
4. 新增以下兩個變數：

| Key (變數名稱) | Value (數值) | 說明 |
|---|---|---|
| `VITE_SUPABASE_URL` | 您的 Supabase Project URL | 在 Supabase Settings > API 找得到 |
| `VITE_SUPABASE_KEY` | 您的 Supabase anon/public Key | 在 Supabase Settings > API 找得到 |

*(注意：原本的 Contentful 變數如果不需要了可以刪除)*

5. 新增完成後，到 **Deployments** 分頁，點擊最新的部署 (或 Redeploy)，網站就會讀取到這些設定並正常顯示了！
更新部署測試