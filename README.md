# スーパー最安値ナビ

主婦目線で作った、近所のスーパーの最安値を一目で比較できるアプリです。

## 🚀 Vercelへのデプロイ手順

### 1. GitHubにコードをアップロード

#### 方法A: GitHub Desktopを使う（初心者向け・簡単）

1. **GitHub Desktopをインストール**
   - https://desktop.github.com/ からダウンロード
   - GitHubアカウントでログイン

2. **新しいリポジトリを作成**
   - 「File」→「New Repository」をクリック
   - Name: `supermarket-price-app`
   - Local Path: このプロジェクトフォルダを選択
   - 「Create Repository」をクリック

3. **GitHubに公開**
   - 「Publish repository」をクリック
   - 「Publish Repository」をクリック

#### 方法B: コマンドラインを使う（経験者向け）

```bash
# プロジェクトフォルダに移動
cd vercel-deploy

# Gitリポジトリを初期化
git init

# すべてのファイルを追加
git add .

# コミット
git commit -m "Initial commit"

# GitHubで新しいリポジトリを作成後、以下を実行
# (your-username を自分のGitHubユーザー名に置き換え)
git remote add origin https://github.com/your-username/supermarket-price-app.git
git branch -M main
git push -u origin main
```

### 2. Vercelでデプロイ

1. **Vercelにログイン**
   - https://vercel.com にアクセス
   - GitHubアカウントでログイン

2. **新しいプロジェクトを作成**
   - 「Add New...」→「Project」をクリック
   - GitHubのリポジトリ一覧から `supermarket-price-app` を選択
   - 「Import」をクリック

3. **設定を確認**
   - Framework Preset: **Vite** が自動選択されます
   - そのまま「Deploy」をクリック

4. **デプロイ完了！**
   - 数分待つと、URLが発行されます
   - 例: `https://supermarket-price-app.vercel.app`
   - このURLを友人や家族に共有すれば、誰でもアクセスできます！

## 📱 機能

- ✅ エリア別の価格比較
- ✅ カテゴリー別フィルター
- ✅ ユーザー投稿機能
- ✅ 最安値の自動表示
- ✅ レスポンシブデザイン（スマホ・タブレット・PC対応）

## 🛠 ローカルで開発する場合

```bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev

# ブラウザで http://localhost:5173 を開く
```

## 📝 更新方法

コードを変更したら：

**GitHub Desktop使用の場合:**
1. 変更したファイルが左側に表示される
2. 下部のテキストボックスにコミットメッセージを入力（例: "デザインを改善"）
3. 「Commit to main」をクリック
4. 「Push origin」をクリック
→ Vercelが自動的に再デプロイします！

**コマンドライン使用の場合:**
```bash
git add .
git commit -m "変更内容の説明"
git push
```

## 🎯 カスタマイズのヒント

- `src/App.jsx` - メインのアプリロジック
- エリアやスーパー名は自由に変更できます
- カテゴリも追加・削除可能です

---

作成者: あなたの名前
