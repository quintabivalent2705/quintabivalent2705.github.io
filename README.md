# Wang Xiaopei · Academic Homepage

王潇霈的公开学术主页，提供英文、中文和越南语版本，集中展示研究方向、代表项目、学术成果与合作经历。

- 网站：[https://xiaopei388.github.io/](https://xiaopei388.github.io/)
- 仓库：[xiaopei388/xiaopei388.github.io](https://github.com/xiaopei388/xiaopei388.github.io)

## 技术栈

- Vue 3
- Vue Router
- Vite
- GitHub Pages

## 本地运行

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

构建命令会先校验公开内容数据及其关联，再生成静态网站。

## 公开内容源

网站公开资料维护在 [`content/site_content_20260822-1705-UTC+0700.md`](content/site_content_20260822-1705-UTC+0700.md)。页面界面和语言切换位于 [`src/`](src/)，内容结构校验由 [`scripts/validate_content_20260822-1705-UTC+0700.mjs`](scripts/validate_content_20260822-1705-UTC+0700.mjs) 执行。

## 部署

推送至 `main` 分支后，[GitHub Pages 工作流](.github/workflows/deploy-pages.yml)自动完成校验、构建与发布。`dist/` 是本地构建产物，不直接提交。

## 公开信息与隐私边界

本仓库及其提交历史均按公开材料管理，只保存网站实际展示且已确认可公开的内容。不得提交密码、访问令牌、API 密钥、私钥、身份证件、家庭地址、私人联系方式、未公开客户或合作信息、合同资料、保密研究数据及其他内部记录。
