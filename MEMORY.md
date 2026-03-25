# MEMORY.md - Long-term Memory

## 项目

### Clash Royale V2 (当前)
- **位置**: `/home/ubuntu/clash-royale-v2`
- **GitHub**: https://github.com/youyouxiangwang-prog/clash-royale-v2
- **技术栈**: React 18 + TypeScript + Vite + Canvas
- **状态**: Phase 2 完成，等待Phase 3

### Clash Royale V1 (已废弃)
- **位置**: `/home/ubuntu/clash-royale-game`
- **废弃原因**: 视觉效果太差，"完全没法看"
- **教训**: 必须验证后再声称完成

---

## 教训

### 2026-03-25: 红线一违反
- **错误**: 没验证就声称"完成"
- **后果**: 纹理路径错误，背景显示纯黑色
- **根因**: 开发路径 vs 生产路径混淆
- **改进**: 每次改动必须验证实际效果

---

## 用户偏好

- 注重UI/UX质量
- 希望看到类似参考项目的视觉效果
- 分阶段开发，每阶段验证
- 先做Deep Research再动手

---

## 技术笔记

### 推荐技术栈
- React 18 + TypeScript + Vite + Canvas (当前选择)
- 原因: 可维护、现代化、类型安全

### 参考资源
- kylemath/ClashRoyale: 最佳参考项目
- cr-assets-png: 素材资源

---

*最后更新: 2026-03-25*