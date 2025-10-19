"use client";

import React, { useState } from 'react';
import { BookOpen, Copy, Check, Eye, Code, FileText, Table, Hash, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function MarkdownGuide() {
    const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

    const copyToClipboard = async (text: string, itemId: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopiedItems(prev => new Set(prev).add(itemId));
            setTimeout(() => {
                setCopiedItems(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(itemId);
                    return newSet;
                });
            }, 2000);
        } catch (err) {
            console.error('复制失败:', err);
        }
    };

    const CodeExample = ({ children, id }: { children: string; id: string }) => (
        <div className="relative w-full">
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap break-words max-w-full">
                <code className="block">{children}</code>
            </pre>
            <Button
                size="sm"
                variant="outline"
                className="absolute top-2 right-2 bg-slate-800 border-slate-600 text-slate-200 hover:bg-slate-700 z-10"
                onClick={() => copyToClipboard(children, id)}
            >
                {copiedItems.has(id) ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
        </div>
    );

    const ExampleCard = ({ title, description, markdown, html, id }: { title: string; description: string; markdown: string; html: string; id: string }) => (
        <Card className="bg-slate-50 border-slate-200 w-full max-w-full overflow-hidden">
            <CardHeader>
                <CardTitle className="text-lg text-slate-700 break-words">{title}</CardTitle>
                <CardDescription className="text-slate-600 break-words">{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 w-full">
                <div className="w-full">
                    <h4 className="font-medium text-slate-700 mb-2">Markdown 语法：</h4>
                    <CodeExample id={`${id}-md`}>{markdown}</CodeExample>
                </div>
                <div className="w-full">
                    <h4 className="font-medium text-slate-700 mb-2">渲染效果：</h4>
                    <div className="bg-white border border-slate-300 rounded-lg p-4 w-full overflow-hidden markdown-content" dangerouslySetInnerHTML={{ __html: html }} />
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
            <style dangerouslySetInnerHTML={{
                __html: `
                    div.markdown-content h1 {
                        font-size: 2rem !important;
                        font-weight: bold !important;
                        margin: 1rem 0 !important;
                        line-height: 1.2 !important;
                        display: block !important;
                        color: #1f2937 !important;
                    }
                    div.markdown-content h2 {
                        font-size: 1.5rem !important;
                        font-weight: bold !important;
                        margin: 0.875rem 0 !important;
                        line-height: 1.3 !important;
                        display: block !important;
                        color: #1f2937 !important;
                    }
                    div.markdown-content h3 {
                        font-size: 1.25rem !important;
                        font-weight: bold !important;
                        margin: 0.75rem 0 !important;
                        line-height: 1.4 !important;
                        display: block !important;
                        color: #1f2937 !important;
                    }
                    div.markdown-content h4 {
                        font-size: 1.125rem !important;
                        font-weight: bold !important;
                        margin: 0.625rem 0 !important;
                        line-height: 1.4 !important;
                        display: block !important;
                        color: #1f2937 !important;
                    }
                    div.markdown-content h5 {
                        font-size: 1rem !important;
                        font-weight: bold !important;
                        margin: 0.5rem 0 !important;
                        line-height: 1.5 !important;
                        display: block !important;
                        color: #1f2937 !important;
                    }
                    div.markdown-content h6 {
                        font-size: 0.875rem !important;
                        font-weight: bold !important;
                        margin: 0.5rem 0 !important;
                        line-height: 1.5 !important;
                        display: block !important;
                        color: #1f2937 !important;
                    }
                    div.markdown-content p {
                        margin: 0.5rem 0 !important;
                        line-height: 1.6 !important;
                        color: #374151 !important;
                    }
                    div.markdown-content strong {
                        font-weight: bold !important;
                        color: #1f2937 !important;
                    }
                    div.markdown-content em {
                        font-style: italic !important;
                        color: #374151 !important;
                    }
                    div.markdown-content del {
                        text-decoration: line-through !important;
                        color: #6b7280 !important;
                    }
                    div.markdown-content code {
                        background-color: #f3f4f6 !important;
                        padding: 0.125rem 0.25rem !important;
                        border-radius: 0.25rem !important;
                        font-family: 'Courier New', monospace !important;
                        font-size: 0.875rem !important;
                        color: #dc2626 !important;
                    }
                    div.markdown-content ul, div.markdown-content ol {
                        margin: 0.5rem 0 !important;
                        padding-left: 1.5rem !important;
                        color: #374151 !important;
                    }
                    div.markdown-content li {
                        margin: 0.25rem 0 !important;
                        color: #374151 !important;
                    }
                    div.markdown-content blockquote {
                        border-left: 4px solid #d1d5db !important;
                        padding-left: 1rem !important;
                        margin: 1rem 0 !important;
                        font-style: italic !important;
                        color: #6b7280 !important;
                        background-color: #f9fafb !important;
                    }
                    div.markdown-content table {
                        width: 100% !important;
                        border-collapse: collapse !important;
                        margin: 1rem 0 !important;
                    }
                    div.markdown-content th, div.markdown-content td {
                        border: 1px solid #d1d5db !important;
                        padding: 0.5rem !important;
                        text-align: left !important;
                    }
                    div.markdown-content th {
                        background-color: #f9fafb !important;
                        font-weight: bold !important;
                        color: #1f2937 !important;
                    }
                    div.markdown-content td {
                        color: #374151 !important;
                    }
                    div.markdown-content hr {
                        border: none !important;
                        border-top: 1px solid #d1d5db !important;
                        margin: 2rem 0 !important;
                    }
                    div.markdown-content a {
                        color: #3b82f6 !important;
                        text-decoration: underline !important;
                    }
                    div.markdown-content a:hover {
                        color: #1d4ed8 !important;
                    }
                    div.markdown-content img {
                        max-width: 100% !important;
                        height: auto !important;
                        border-radius: 0.25rem !important;
                    }
                `
            }} />
            <div className="max-w-7xl mx-auto">
                <Card className="border-slate-200 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-slate-400 to-gray-400 text-white rounded-t-lg">
                        <CardTitle className="text-4xl font-bold flex items-center gap-3">
                            <BookOpen className="w-10 h-10" />
                            Markdown 完整指南
                        </CardTitle>
                        <CardDescription className="text-slate-200 text-lg">
                            从基础语法到高级技巧，掌握 Markdown 标记语言
                        </CardDescription>
                        <div className="mt-4">
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            >
                                <a 
                                    href="https://daringfireball.net/projects/markdown/" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    访问 Markdown 官方网站
                                </a>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">

                        {/* 简介 */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">什么是 Markdown？</h2>
                            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                                <p className="text-slate-700 leading-relaxed mb-4">
                                    Markdown 是一种轻量级标记语言，由 John Gruber 和 Aaron Swartz 创建。
                                    它允许人们使用易读易写的纯文本格式编写文档，然后转换成有效的 HTML。
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <FileText className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                                        <h3 className="font-semibold text-slate-800">简单易学</h3>
                                        <p className="text-sm text-slate-600">语法简洁，几分钟就能学会</p>
                                    </div>
                                    <div className="text-center">
                                        <Eye className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                                        <h3 className="font-semibold text-slate-800">可读性强</h3>
                                        <p className="text-sm text-slate-600">纯文本格式，清晰易读</p>
                                    </div>
                                    <div className="text-center">
                                        <Code className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                                        <h3 className="font-semibold text-slate-800">通用性好</h3>
                                        <p className="text-sm text-slate-600">支持 GitHub、GitLab 等平台</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Tabs defaultValue="basics" className="w-full">
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="basics">基础语法</TabsTrigger>
                                <TabsTrigger value="advanced">高级功能</TabsTrigger>
                                <TabsTrigger value="tables">表格</TabsTrigger>
                                <TabsTrigger value="extensions">扩展语法</TabsTrigger>
                                <TabsTrigger value="tools">工具推荐</TabsTrigger>
                            </TabsList>

                            {/* 基础语法 */}
                            <TabsContent value="basics" className="space-y-8 w-full">
                                <div className="w-full">
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <Hash className="w-6 h-6" />
                                        基础语法
                                    </h2>

                                    <div className="grid gap-6 w-full">
                                        {/* 标题 */}
                                        <ExampleCard
                                            title="标题 (Headings)"
                                            description="使用 # 号创建标题，数量越多级别越低"
                                            markdown={`# 一级标题
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题`}
                                            html={`<h1>一级标题</h1>
<h2>二级标题</h2>
<h3>三级标题</h3>
<h4>四级标题</h4>
<h5>五级标题</h5>
<h6>六级标题</h6>`}
                                            id="headings"
                                        />

                                        {/* 文本格式 */}
                                        <ExampleCard
                                            title="文本格式"
                                            description="粗体、斜体、删除线等文本样式"
                                            markdown={`**粗体文本** 或 __粗体文本__
*斜体文本* 或 _斜体文本_
~~删除线文本~~
\`行内代码\``}
                                            html={`<p><strong>粗体文本</strong> 或 <strong>粗体文本</strong><br>
<em>斜体文本</em> 或 <em>斜体文本</em><br>
<del>删除线文本</del><br>
<code>行内代码</code></p>`}
                                            id="text-formatting"
                                        />

                                        {/* 列表 */}
                                        <ExampleCard
                                            title="列表"
                                            description="有序列表和无序列表"
                                            markdown={`无序列表：
- 项目一
- 项目二
  - 子项目 2.1
  - 子项目 2.2

有序列表：
1. 第一项
2. 第二项
3. 第三项`}
                                            html={`<p>无序列表：</p>
<ul>
<li>项目一</li>
<li>项目二
<ul>
<li>子项目 2.1</li>
<li>子项目 2.2</li>
</ul>
</li>
</ul>
<p>有序列表：</p>
<ol>
<li>第一项</li>
<li>第二项</li>
<li>第三项</li>
</ol>`}
                                            id="lists"
                                        />

                                        {/* 链接和图片 */}
                                        <ExampleCard
                                            title="链接和图片"
                                            description="创建链接和插入图片"
                                            markdown={`[Markdown 官方文档](https://daringfireball.net/projects/markdown/)
[GitHub Markdown 指南](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax "GitHub 官方指南")

![Markdown Logo](https://daringfireball.net/graphics/logos/)
![Markdown 语法图](https://markdown-here.com/img/icon256.png "Markdown Here 图标")`}
                                            html={`<p><a href="https://daringfireball.net/projects/markdown/">Markdown 官方文档</a><br>
<a href="https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax" title="GitHub 官方指南">GitHub Markdown 指南</a></p>

<p><img src="https://daringfireball.net/graphics/logos/" alt="Markdown Logo" /><br>
<img src="https://markdown-here.com/img/icon256.png" alt="Markdown 语法图" title="Markdown Here 图标" /></p>`}
                                            id="links-images"
                                        />

                                        {/* 引用 */}
                                        <ExampleCard
                                            title="引用"
                                            description="使用 > 创建引用块"
                                            markdown={`> 这是一个引用块
> 
> 可以包含多行内容
> 
> > 这是嵌套引用`}
                                            html={`<blockquote>
<p>这是一个引用块</p>
<p>可以包含多行内容</p>
<blockquote>
<p>这是嵌套引用</p>
</blockquote>
</blockquote>`}
                                            id="blockquotes"
                                        />

                                        {/* 代码块 */}
                                        <ExampleCard
                                            title="代码块"
                                            description="使用 ``` 创建代码块"
                                            markdown={`\`\`\`javascript
function hello() {
    console.log("Hello, World!");
}
\`\`\``}
                                            html={`<pre><code class="language-javascript">function hello() {
    console.log("Hello, World!");
}</code></pre>`}
                                            id="code-blocks"
                                        />

                                        {/* 分隔线 */}
                                        <ExampleCard
                                            title="分隔线"
                                            description="使用 --- 或 *** 创建分隔线"
                                            markdown={`段落一

---

段落二

***`}
                                            html={`<p>段落一</p>
<hr>
<p>段落二</p>
<hr>`}
                                            id="horizontal-rules"
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* 高级功能 */}
                            <TabsContent value="advanced" className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <Code className="w-6 h-6" />
                                        高级功能
                                    </h2>

                                    <div className="grid gap-6">
                                        {/* 任务列表 */}
                                        <ExampleCard
                                            title="任务列表"
                                            description="GitHub 风格的任务列表"
                                            markdown={`- [x] 已完成的任务
- [ ] 未完成的任务
- [ ] 另一个任务`}
                                            html={`<ul>
<li><input type="checkbox" checked disabled> 已完成的任务</li>
<li><input type="checkbox" disabled> 未完成的任务</li>
<li><input type="checkbox" disabled> 另一个任务</li>
</ul>`}
                                            id="task-lists"
                                        />

                                        {/* 脚注 */}
                                        <ExampleCard
                                            title="脚注"
                                            description="添加脚注引用"
                                            markdown={`这是一个带脚注的句子[^1]。

[^1]: 这是脚注内容。`}
                                            html={`<p>这是一个带脚注的句子<sup><a href="#fn1" id="ref1">1</a></sup>。</p>
<div class="footnotes">
<hr>
<ol>
<li id="fn1">这是脚注内容。<a href="#ref1">↩</a></li>
</ol>
</div>`}
                                            id="footnotes"
                                        />

                                        {/* 定义列表 */}
                                        <ExampleCard
                                            title="定义列表"
                                            description="创建术语和定义的列表"
                                            markdown={`术语一
: 定义一

术语二
: 定义二
: 另一个定义`}
                                            html={`<dl>
<dt>术语一</dt>
<dd>定义一</dd>
<dt>术语二</dt>
<dd>定义二</dd>
<dd>另一个定义</dd>
</dl>`}
                                            id="definition-lists"
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* 表格 */}
                            <TabsContent value="tables" className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <Table className="w-6 h-6" />
                                        表格
                                    </h2>

                                    <div className="grid gap-6">
                                        {/* 基础表格 */}
                                        <ExampleCard
                                            title="基础表格"
                                            description="使用 | 创建表格"
                                            markdown={`| 列1 | 列2 | 列3 |
|-----|-----|-----|
| 行1 | 数据1 | 数据2 |
| 行2 | 数据3 | 数据4 |`}
                                            html={`<table>
<thead>
<tr>
<th>列1</th>
<th>列2</th>
<th>列3</th>
</tr>
</thead>
<tbody>
<tr>
<td>行1</td>
<td>数据1</td>
<td>数据2</td>
</tr>
<tr>
<td>行2</td>
<td>数据3</td>
<td>数据4</td>
</tr>
</tbody>
</table>`}
                                            id="basic-table"
                                        />

                                        {/* 对齐表格 */}
                                        <ExampleCard
                                            title="表格对齐"
                                            description="控制表格列的对齐方式"
                                            markdown={`| 左对齐 | 居中对齐 | 右对齐 |
|:-------|:-------:|-------:|
| 内容1 | 内容2 | 内容3 |
| 内容4 | 内容5 | 内容6 |`}
                                            html={`<table>
<thead>
<tr>
<th style="text-align: left">左对齐</th>
<th style="text-align: center">居中对齐</th>
<th style="text-align: right">右对齐</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align: left">内容1</td>
<td style="text-align: center">内容2</td>
<td style="text-align: right">内容3</td>
</tr>
<tr>
<td style="text-align: left">内容4</td>
<td style="text-align: center">内容5</td>
<td style="text-align: right">内容6</td>
</tr>
</tbody>
</table>`}
                                            id="aligned-table"
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* 扩展语法 */}
                            <TabsContent value="extensions" className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <Code className="w-6 h-6" />
                                        扩展语法
                                    </h2>

                                    <div className="grid gap-6">
                                        {/* 数学公式 */}
                                        <ExampleCard
                                            title="数学公式"
                                            description="使用 LaTeX 语法创建数学公式"
                                            markdown={`行内公式：$E = mc^2$

块级公式：
$$
\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n
$$`}
                                            html={`<p>行内公式：<span class="math">E = mc^2</span></p>
<div class="math">
\\sum_{i=1}^{n} x_i = x_1 + x_2 + \\cdots + x_n
</div>`}
                                            id="math-formulas"
                                        />

                                        {/* 图表 */}
                                        <ExampleCard
                                            title="图表"
                                            description="使用 Mermaid 创建图表"
                                            markdown={`\`\`\`mermaid
graph TD
    A[开始] --> B{判断条件}
    B -->|是| C[执行操作1]
    B -->|否| D[执行操作2]
    C --> E[结束]
    D --> E
\`\`\``}
                                            html={`<div class="mermaid">
graph TD
    A[开始] --> B{判断条件}
    B -->|是| C[执行操作1]
    B -->|否| D[执行操作2]
    C --> E[结束]
    D --> E
</div>`}
                                            id="diagrams"
                                        />

                                        {/* 高亮文本 */}
                                        <ExampleCard
                                            title="高亮文本"
                                            description="使用 == 高亮文本"
                                            markdown={`这是 ==高亮文本== 的示例。`}
                                            html={`<p>这是 <mark>高亮文本</mark> 的示例。</p>`}
                                            id="highlighted-text"
                                        />

                                        {/* 上标和下标 */}
                                        <ExampleCard
                                            title="上标和下标"
                                            description="使用 ^ 和 ~ 创建上标和下标"
                                            markdown={`H~2~O 是水的化学式。
E = mc^2^ 是质能方程。`}
                                            html={`<p>H<sub>2</sub>O 是水的化学式。<br>
E = mc<sup>2</sup> 是质能方程。</p>`}
                                            id="superscript-subscript"
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* 工具推荐 */}
                            <TabsContent value="tools" className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <FileText className="w-6 h-6" />
                                        工具推荐
                                    </h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {/* 在线编辑器 */}
                                        <Card className="bg-slate-50 border-slate-200">
                                            <CardHeader>
                                                <CardTitle className="text-lg text-slate-700">在线编辑器</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">StackEdit</h4>
                                                        <p className="text-sm text-slate-600">功能强大的在线 Markdown 编辑器</p>
                                                    </div>
                                                    <Badge variant="outline">推荐</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">Dillinger</h4>
                                                        <p className="text-sm text-slate-600">简洁的在线 Markdown 编辑器</p>
                                                    </div>
                                                    <Badge variant="outline">简洁</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">Markdown Live Preview</h4>
                                                        <p className="text-sm text-slate-600">实时预览的编辑器</p>
                                                    </div>
                                                    <Badge variant="outline">实时</Badge>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* 桌面应用 */}
                                        <Card className="bg-slate-50 border-slate-200">
                                            <CardHeader>
                                                <CardTitle className="text-lg text-slate-700">桌面应用</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">Typora</h4>
                                                        <p className="text-sm text-slate-600">所见即所得的编辑器</p>
                                                    </div>
                                                    <Badge variant="outline">WYSIWYG</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">Mark Text</h4>
                                                        <p className="text-sm text-slate-600">开源的实时预览编辑器</p>
                                                    </div>
                                                    <Badge variant="outline">开源</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">Obsidian</h4>
                                                        <p className="text-sm text-slate-600">知识管理和笔记应用</p>
                                                    </div>
                                                    <Badge variant="outline">笔记</Badge>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* VS Code 插件 */}
                                        <Card className="bg-slate-50 border-slate-200">
                                            <CardHeader>
                                                <CardTitle className="text-lg text-slate-700">VS Code 插件</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">Markdown All in One</h4>
                                                        <p className="text-sm text-slate-600">全套 Markdown 工具</p>
                                                    </div>
                                                    <Badge variant="outline">必备</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">Markdown Preview Enhanced</h4>
                                                        <p className="text-sm text-slate-600">增强的预览功能</p>
                                                    </div>
                                                    <Badge variant="outline">增强</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">Paste Image</h4>
                                                        <p className="text-sm text-slate-600">快速粘贴图片</p>
                                                    </div>
                                                    <Badge variant="outline">实用</Badge>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* 在线工具 */}
                                        <Card className="bg-slate-50 border-slate-200">
                                            <CardHeader>
                                                <CardTitle className="text-lg text-slate-700">在线工具</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">Markdown to HTML</h4>
                                                        <p className="text-sm text-slate-600">Markdown 转 HTML</p>
                                                    </div>
                                                    <Badge variant="outline">转换</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">Table Generator</h4>
                                                        <p className="text-sm text-slate-600">表格生成器</p>
                                                    </div>
                                                    <Badge variant="outline">生成</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">Mermaid Live Editor</h4>
                                                        <p className="text-sm text-slate-600">图表编辑器</p>
                                                    </div>
                                                    <Badge variant="outline">图表</Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </TabsContent>
                        </Tabs>

                        {/* 最佳实践 */}
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">最佳实践</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Card className="bg-green-50 border-green-200">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-green-800">✅ 推荐做法</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="text-sm text-green-700 space-y-2">
                                            <li>• 使用语义化的标题结构</li>
                                            <li>• 保持一致的格式风格</li>
                                            <li>• 适当使用空行分隔内容</li>
                                            <li>• 为图片添加有意义的描述</li>
                                            <li>• 使用代码块语法高亮</li>
                                            <li>• 表格使用对齐方式</li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card className="bg-red-50 border-red-200">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-red-800">❌ 避免做法</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="text-sm text-red-700 space-y-2">
                                            <li>• 不要混用不同的标题符号</li>
                                            <li>• 避免过长的行（超过 80 字符）</li>
                                            <li>• 不要使用过多的格式化符号</li>
                                            <li>• 避免嵌套过深的列表</li>
                                            <li>• 不要忘记为链接添加描述文本</li>
                                            <li>• 避免使用过多的表格</li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* 使用说明 */}
                        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h3 className="font-semibold text-slate-800 mb-2">使用说明：</h3>
                            <ul className="text-sm text-slate-700 space-y-1">
                                <li>• 点击代码示例右上角的复制按钮可以复制语法</li>
                                <li>• 每个示例都包含 Markdown 语法和渲染效果</li>
                                <li>• 可以通过不同的标签页学习不同难度的内容</li>
                                <li>• 建议从基础语法开始，逐步学习高级功能</li>
                                <li>• 实际使用中建议配合编辑器插件提高效率</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
