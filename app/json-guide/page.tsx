"use client";

import React, { useState } from 'react';
import { FileJson, Copy, Check, Eye, Code, FileText, Database, Zap, Globe, Shield, AlertTriangle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function JsonGuide() {
    const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

    const copyToClipboard = async (text: string, itemId: string, event?: React.MouseEvent) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
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
                className="absolute top-2 right-2 bg-white border-slate-300 text-slate-700 hover:bg-gray-50 z-10"
                onClick={(e) => copyToClipboard(children, id, e)}
            >
                {copiedItems.has(id) ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
        </div>
    );

    const ExampleCard = ({ title, description, json, id, isValid = true }: { title: string; description: string; json: string; id: string; isValid?: boolean }) => (
        <Card className="bg-slate-50 border-slate-200 w-full max-w-full overflow-hidden">
            <CardHeader>
                <CardTitle className="text-lg text-slate-700 break-words flex items-center gap-2">
                    {title}
                    {!isValid && <Badge variant="destructive" className="text-xs">语法错误</Badge>}
                </CardTitle>
                <CardDescription className="text-slate-600 break-words">{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 w-full">
                <div className="w-full">
                    <h4 className="font-medium text-slate-700 mb-2">JSON 示例：</h4>
                    <CodeExample id={id}>{json}</CodeExample>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
            <div className="max-w-7xl mx-auto">
                <Card className="border-slate-200 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-slate-400 to-gray-400 text-white rounded-t-lg">
                        <CardTitle className="text-4xl font-bold flex items-center gap-3">
                            <FileJson className="w-10 h-10" />
                            JSON 完整指南
                        </CardTitle>
                        <CardDescription className="text-slate-200 text-lg">
                            从基础语法到高级应用，掌握 JSON 数据格式
                        </CardDescription>
                        <div className="mt-4">
                            <Button
                                asChild
                                variant="outline"
                                size="sm"
                                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                            >
                                <a
                                    href="https://www.json.org/json-zh.html"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    访问 JSON 官方网站
                                </a>
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-8">

                        {/* 简介 */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-slate-800 mb-4">什么是 JSON？</h2>
                            <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
                                <p className="text-slate-700 leading-relaxed mb-4">
                                    JSON（JavaScript Object Notation）是一种轻量级的数据交换格式。
                                    它基于 JavaScript 的一个子集，易于人阅读和编写，同时也易于机器解析和生成。
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="text-center">
                                        <FileText className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                                        <h3 className="font-semibold text-slate-800">轻量级</h3>
                                        <p className="text-sm text-slate-600">比 XML 更简洁</p>
                                    </div>
                                    <div className="text-center">
                                        <Eye className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                                        <h3 className="font-semibold text-slate-800">易读性</h3>
                                        <p className="text-sm text-slate-600">人类可读格式</p>
                                    </div>
                                    <div className="text-center">
                                        <Database className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                                        <h3 className="font-semibold text-slate-800">通用性</h3>
                                        <p className="text-sm text-slate-600">跨语言支持</p>
                                    </div>
                                    <div className="text-center">
                                        <Zap className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                                        <h3 className="font-semibold text-slate-800">高效性</h3>
                                        <p className="text-sm text-slate-600">快速解析</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Tabs defaultValue="basics" className="w-full">
                            <TabsList className="grid w-full grid-cols-6">
                                <TabsTrigger value="basics">基础语法</TabsTrigger>
                                <TabsTrigger value="datatypes">数据类型</TabsTrigger>
                                <TabsTrigger value="validation">验证</TabsTrigger>
                                <TabsTrigger value="advanced">高级应用</TabsTrigger>
                                <TabsTrigger value="apis">API 集成</TabsTrigger>
                                <TabsTrigger value="tools">工具推荐</TabsTrigger>
                            </TabsList>

                            {/* 基础语法 */}
                            <TabsContent value="basics" className="space-y-8 w-full">
                                <div className="w-full">
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <Code className="w-6 h-6" />
                                        基础语法
                                    </h2>

                                    <div className="grid gap-6 w-full">
                                        {/* JSON 结构 */}
                                        <ExampleCard
                                            title="JSON 基本结构"
                                            description="JSON 由键值对组成，使用大括号包围对象，方括号包围数组"
                                            json={`{
  "name": "张三",
  "age": 25,
  "isStudent": true,
  "hobbies": ["读书", "游泳", "编程"],
  "address": {
    "city": "北京",
    "district": "朝阳区"
  }
}`}
                                            id="basic-structure"
                                        />

                                        {/* 语法规则 */}
                                        <ExampleCard
                                            title="语法规则"
                                            description="JSON 的语法规则和注意事项"
                                            json={`{
  "规则1": "键必须用双引号包围",
  "规则2": "字符串值必须用双引号",
  "规则3": "不能使用单引号",
  "规则4": "最后一个元素后不能有逗号",
  "规则5": "支持嵌套结构"
}`}
                                            id="syntax-rules"
                                        />

                                        {/* 常见错误 */}
                                        <ExampleCard
                                            title="常见错误示例"
                                            description="这些是无效的 JSON 格式"
                                            json={`{
  'name': '张三',        // 错误：使用单引号
  age: 25,              // 错误：键没有引号
  "city": "北京",       // 错误：最后一个元素后有逗号
  "isValid": true
}`}
                                            id="common-errors"
                                            isValid={false}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* 数据类型 */}
                            <TabsContent value="datatypes" className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <Database className="w-6 h-6" />
                                        数据类型
                                    </h2>

                                    <div className="grid gap-6">
                                        {/* 基本数据类型 */}
                                        <ExampleCard
                                            title="基本数据类型"
                                            description="JSON 支持的六种基本数据类型"
                                            json={`{
  "string": "这是一个字符串",
  "number": 42,
  "float": 3.14159,
  "boolean": true,
  "null": null,
  "array": [1, 2, 3, 4, 5]
}`}
                                            id="basic-datatypes"
                                        />

                                        {/* 字符串 */}
                                        <ExampleCard
                                            title="字符串类型"
                                            description="字符串的表示方法和转义字符"
                                            json={`{
  "simple": "简单字符串",
  "withQuotes": "包含\\"引号\\"的字符串",
  "withNewline": "第一行\\n第二行",
  "withTab": "制表符\\t分隔",
  "withBackslash": "反斜杠\\\\示例",
  "unicode": "Unicode: \\u4e2d\\u6587"
}`}
                                            id="string-types"
                                        />

                                        {/* 数字 */}
                                        <ExampleCard
                                            title="数字类型"
                                            description="整数、浮点数和科学计数法"
                                            json={`{
  "integer": 123,
  "negative": -456,
  "float": 12.34,
  "negativeFloat": -56.78,
  "scientific": 1.23e4,
  "negativeScientific": -5.67e-2,
  "zero": 0,
  "negativeZero": -0
}`}
                                            id="number-types"
                                        />

                                        {/* 布尔值 */}
                                        <ExampleCard
                                            title="布尔类型"
                                            description="只有 true 和 false 两个值"
                                            json={`{
  "isTrue": true,
  "isFalse": false,
  "userActive": true,
  "accountLocked": false
}`}
                                            id="boolean-types"
                                        />

                                        {/* 数组 */}
                                        <ExampleCard
                                            title="数组类型"
                                            description="有序的元素集合，可以包含不同类型的数据"
                                            json={`{
  "numbers": [1, 2, 3, 4, 5],
  "strings": ["apple", "banana", "orange"],
  "mixed": [1, "hello", true, null],
  "nested": [
    {"name": "张三", "age": 25},
    {"name": "李四", "age": 30}
  ],
  "empty": []
}`}
                                            id="array-types"
                                        />

                                        {/* 对象 */}
                                        <ExampleCard
                                            title="对象类型"
                                            description="键值对的集合，可以嵌套"
                                            json={`{
  "user": {
    "id": 1,
    "name": "张三",
    "profile": {
      "avatar": "https://example.com/avatar.jpg",
      "bio": "软件工程师"
    },
    "permissions": ["read", "write", "admin"]
  },
  "metadata": {
    "created": "2024-01-01T00:00:00Z",
    "version": "1.0.0"
  }
}`}
                                            id="object-types"
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* 验证 */}
                            <TabsContent value="validation" className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <Check className="w-6 h-6" />
                                        JSON 验证
                                    </h2>

                                    <div className="grid gap-6">
                                        {/* JSON Schema */}
                                        <ExampleCard
                                            title="JSON Schema 示例"
                                            description="使用 JSON Schema 定义数据结构"
                                            json={`{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "name": {
      "type": "string",
      "minLength": 1,
      "maxLength": 50
    },
    "age": {
      "type": "integer",
      "minimum": 0,
      "maximum": 150
    },
    "email": {
      "type": "string",
      "format": "email"
    },
    "hobbies": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "minItems": 1
    }
  },
  "required": ["name", "age", "email"]
}`}
                                            id="json-schema"
                                        />

                                        {/* 验证示例数据 */}
                                        <ExampleCard
                                            title="符合 Schema 的数据"
                                            description="这个数据符合上面的 Schema 定义"
                                            json={`{
  "name": "张三",
  "age": 25,
  "email": "zhangsan@example.com",
  "hobbies": ["读书", "游泳"]
}`}
                                            id="valid-data"
                                        />

                                        {/* 无效数据示例 */}
                                        <ExampleCard
                                            title="无效数据示例"
                                            description="这些数据不符合 Schema 定义"
                                            json={`{
  "name": "",                    // 错误：空字符串
  "age": -5,                     // 错误：负数
  "email": "invalid-email",      // 错误：无效邮箱格式
  "hobbies": []                  // 错误：空数组
}`}
                                            id="invalid-data"
                                            isValid={false}
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* 高级应用 */}
                            <TabsContent value="advanced" className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <Zap className="w-6 h-6" />
                                        高级应用
                                    </h2>

                                    <div className="grid gap-6">
                                        {/* 配置文件 */}
                                        <ExampleCard
                                            title="配置文件示例"
                                            description="使用 JSON 作为应用程序配置"
                                            json={`{
  "app": {
    "name": "My Application",
    "version": "1.2.3",
    "debug": false
  },
  "database": {
    "host": "localhost",
    "port": 5432,
    "name": "myapp_db",
    "ssl": true
  },
  "api": {
    "baseUrl": "https://api.example.com",
    "timeout": 5000,
    "retries": 3
  },
  "features": {
    "userRegistration": true,
    "emailNotifications": false,
    "analytics": true
  }
}`}
                                            id="config-file"
                                        />

                                        {/* API 响应 */}
                                        <ExampleCard
                                            title="API 响应格式"
                                            description="标准的 REST API 响应格式"
                                            json={`{
  "status": "success",
  "code": 200,
  "message": "操作成功",
  "data": {
    "users": [
      {
        "id": 1,
        "name": "张三",
        "email": "zhangsan@example.com",
        "createdAt": "2024-01-01T10:00:00Z",
        "lastLogin": "2024-01-15T14:30:00Z"
      },
      {
        "id": 2,
        "name": "李四",
        "email": "lisi@example.com",
        "createdAt": "2024-01-02T09:15:00Z",
        "lastLogin": null
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 2,
      "totalPages": 1
    }
  },
  "meta": {
    "requestId": "req-123456",
    "timestamp": "2024-01-15T15:45:00Z"
  }
}`}
                                            id="api-response"
                                        />

                                        {/* 复杂嵌套结构 */}
                                        <ExampleCard
                                            title="复杂嵌套结构"
                                            description="多层嵌套的复杂 JSON 结构"
                                            json={`{
  "company": {
    "name": "科技有限公司",
    "founded": "2020",
    "employees": [
      {
        "id": 1,
        "name": "张三",
        "position": "高级工程师",
        "department": {
          "name": "研发部",
          "manager": "李经理",
          "budget": {
            "annual": 1000000,
            "currency": "CNY"
          }
        },
        "skills": [
          {
            "name": "JavaScript",
            "level": "expert",
            "years": 5
          },
          {
            "name": "Python",
            "level": "intermediate",
            "years": 3
          }
        ],
        "projects": [
          {
            "name": "电商平台",
            "status": "completed",
            "technologies": ["React", "Node.js", "MongoDB"],
            "timeline": {
              "start": "2023-01-01",
              "end": "2023-12-31"
            }
          }
        ]
      }
    ]
  }
}`}
                                            id="complex-structure"
                                        />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* API 集成 */}
                            <TabsContent value="apis" className="space-y-8">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                                        <Globe className="w-6 h-6" />
                                        API 集成
                                    </h2>

                                    <div className="grid gap-6">
                                        {/* REST API 请求 */}
                                        <ExampleCard
                                            title="REST API 请求示例"
                                            description="发送 JSON 数据的 HTTP 请求"
                                            json={`{
  "method": "POST",
  "url": "https://api.example.com/users",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer your-token-here"
  },
  "body": {
    "name": "张三",
    "email": "zhangsan@example.com",
    "age": 25,
    "preferences": {
      "notifications": true,
      "language": "zh-CN"
    }
  }
}`}
                                            id="rest-api-request"
                                        />

                                        {/* REST API 响应 */}
                                        <ExampleCard
                                            title="REST API 响应示例"
                                            description="标准的 API 响应格式"
                                            json={`{
  "success": true,
  "status": 201,
  "message": "用户创建成功",
  "data": {
    "id": 123,
    "name": "张三",
    "email": "zhangsan@example.com",
    "age": 25,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "meta": {
    "requestId": "req-abc123",
    "timestamp": "2024-01-15T10:30:00Z",
    "version": "v1.0"
  }
}`}
                                            id="rest-api-response"
                                        />

                                        {/* GraphQL 查询 */}
                                        <ExampleCard
                                            title="GraphQL 查询示例"
                                            description="GraphQL 查询和响应格式"
                                            json={`{
  "query": "query GetUser($id: ID!) { user(id: $id) { id name email posts { title content createdAt } } }",
  "variables": {
    "id": "123"
  }
}`}
                                            id="graphql-query"
                                        />

                                        {/* GraphQL 响应 */}
                                        <ExampleCard
                                            title="GraphQL 响应示例"
                                            description="GraphQL 查询的响应数据"
                                            json={`{
  "data": {
    "user": {
      "id": "123",
      "name": "张三",
      "email": "zhangsan@example.com",
      "posts": [
        {
          "title": "我的第一篇博客",
          "content": "这是博客内容...",
          "createdAt": "2024-01-10T09:00:00Z"
        },
        {
          "title": "技术分享",
          "content": "今天分享一些技术心得...",
          "createdAt": "2024-01-12T14:30:00Z"
        }
      ]
    }
  },
  "extensions": {
    "cost": {
      "requestedQueryCost": 5,
      "maximumAvailable": 1000
    }
  }
}`}
                                            id="graphql-response"
                                        />

                                        {/* WebSocket 消息 */}
                                        <ExampleCard
                                            title="WebSocket 消息示例"
                                            description="实时通信的 JSON 消息格式"
                                            json={`{
  "type": "message",
  "action": "send",
  "payload": {
    "roomId": "room-123",
    "userId": "user-456",
    "message": "你好，大家好！",
    "timestamp": "2024-01-15T15:45:30Z",
    "metadata": {
      "isTyping": false,
      "messageType": "text"
    }
  }
}`}
                                            id="websocket-message"
                                        />

                                        {/* 错误响应 */}
                                        <ExampleCard
                                            title="错误响应示例"
                                            description="API 错误的标准响应格式"
                                            json={`{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "请求参数验证失败",
    "details": [
      {
        "field": "email",
        "message": "邮箱格式不正确"
      },
      {
        "field": "age",
        "message": "年龄必须大于0"
      }
    ]
  },
  "status": 400,
  "timestamp": "2024-01-15T10:30:00Z",
  "requestId": "req-error-123"
}`}
                                            id="error-response"
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
                                        {/* 在线工具 */}
                                        <Card className="bg-slate-50 border-slate-200">
                                            <CardHeader>
                                                <CardTitle className="text-lg text-slate-700">在线工具</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">JSONLint</h4>
                                                        <p className="text-sm text-slate-600">JSON 验证和格式化</p>
                                                    </div>
                                                    <Badge variant="outline">验证</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">JSON Formatter</h4>
                                                        <p className="text-sm text-slate-600">JSON 格式化美化</p>
                                                    </div>
                                                    <Badge variant="outline">格式化</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">JSON Schema Validator</h4>
                                                        <p className="text-sm text-slate-600">Schema 验证工具</p>
                                                    </div>
                                                    <Badge variant="outline">Schema</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">JSON Diff</h4>
                                                        <p className="text-sm text-slate-600">JSON 差异对比</p>
                                                    </div>
                                                    <Badge variant="outline">对比</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">JSON Path Finder</h4>
                                                        <p className="text-sm text-slate-600">JSON 路径查询</p>
                                                    </div>
                                                    <Badge variant="outline">查询</Badge>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* 编辑器插件 */}
                                        <Card className="bg-slate-50 border-slate-200">
                                            <CardHeader>
                                                <CardTitle className="text-lg text-slate-700">编辑器插件</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">JSON Tools (VS Code)</h4>
                                                        <p className="text-sm text-slate-600">JSON 格式化工具</p>
                                                    </div>
                                                    <Badge variant="outline">VS Code</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">JSON Viewer</h4>
                                                        <p className="text-sm text-slate-600">JSON 树形查看器</p>
                                                    </div>
                                                    <Badge variant="outline">查看器</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">JSON Schema</h4>
                                                        <p className="text-sm text-slate-600">Schema 支持</p>
                                                    </div>
                                                    <Badge variant="outline">Schema</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">Prettier</h4>
                                                        <p className="text-sm text-slate-600">代码格式化</p>
                                                    </div>
                                                    <Badge variant="outline">格式化</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">Auto Close Tag</h4>
                                                        <p className="text-sm text-slate-600">自动补全</p>
                                                    </div>
                                                    <Badge variant="outline">补全</Badge>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* 编程语言库 */}
                                        <Card className="bg-slate-50 border-slate-200">
                                            <CardHeader>
                                                <CardTitle className="text-lg text-slate-700">编程语言库</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">JavaScript</h4>
                                                        <p className="text-sm text-slate-600">JSON.parse() / JSON.stringify()</p>
                                                    </div>
                                                    <Badge variant="outline">原生</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">Python</h4>
                                                        <p className="text-sm text-slate-600">json 模块</p>
                                                    </div>
                                                    <Badge variant="outline">标准库</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">Java</h4>
                                                        <p className="text-sm text-slate-600">Jackson / Gson</p>
                                                    </div>
                                                    <Badge variant="outline">第三方</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">C#</h4>
                                                        <p className="text-sm text-slate-600">Newtonsoft.Json</p>
                                                    </div>
                                                    <Badge variant="outline">第三方</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">Go</h4>
                                                        <p className="text-sm text-slate-600">encoding/json</p>
                                                    </div>
                                                    <Badge variant="outline">标准库</Badge>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* 测试工具 */}
                                        <Card className="bg-slate-50 border-slate-200">
                                            <CardHeader>
                                                <CardTitle className="text-lg text-slate-700">测试工具</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">Postman</h4>
                                                        <p className="text-sm text-slate-600">API 测试工具</p>
                                                    </div>
                                                    <Badge variant="outline">API</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">Insomnia</h4>
                                                        <p className="text-sm text-slate-600">REST 客户端</p>
                                                    </div>
                                                    <Badge variant="outline">客户端</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">curl</h4>
                                                        <p className="text-sm text-slate-600">命令行工具</p>
                                                    </div>
                                                    <Badge variant="outline">命令行</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">HTTPie</h4>
                                                        <p className="text-sm text-slate-600">友好的 HTTP 客户端</p>
                                                    </div>
                                                    <Badge variant="outline">友好</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">REST Client (VS Code)</h4>
                                                        <p className="text-sm text-slate-600">VS Code 插件</p>
                                                    </div>
                                                    <Badge variant="outline">插件</Badge>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* 数据库工具 */}
                                        <Card className="bg-slate-50 border-slate-200">
                                            <CardHeader>
                                                <CardTitle className="text-lg text-slate-700">数据库工具</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">MongoDB Compass</h4>
                                                        <p className="text-sm text-slate-600">MongoDB 可视化工具</p>
                                                    </div>
                                                    <Badge variant="outline">MongoDB</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">Redis Desktop Manager</h4>
                                                        <p className="text-sm text-slate-600">Redis 管理工具</p>
                                                    </div>
                                                    <Badge variant="outline">Redis</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">Elasticsearch Head</h4>
                                                        <p className="text-sm text-slate-600">ES 管理界面</p>
                                                    </div>
                                                    <Badge variant="outline">ES</Badge>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* 安全工具 */}
                                        <Card className="bg-slate-50 border-slate-200">
                                            <CardHeader>
                                                <CardTitle className="text-lg text-slate-700">安全工具</CardTitle>
                                            </CardHeader>
                                            <CardContent className="space-y-3">
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">JSON Web Token Debugger</h4>
                                                        <p className="text-sm text-slate-600">JWT 调试工具</p>
                                                    </div>
                                                    <Badge variant="outline">JWT</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">JSON Security Scanner</h4>
                                                        <p className="text-sm text-slate-600">安全扫描工具</p>
                                                    </div>
                                                    <Badge variant="outline">安全</Badge>
                                                </div>
                                                <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                                                    <div>
                                                        <h4 className="font-medium text-slate-800">JSON Encryption Tools</h4>
                                                        <p className="text-sm text-slate-600">加密解密工具</p>
                                                    </div>
                                                    <Badge variant="outline">加密</Badge>
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
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Card className="bg-green-50 border-green-200">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-green-800 flex items-center gap-2">
                                            <Check className="w-5 h-5" />
                                            ✅ 推荐做法
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="text-sm text-green-700 space-y-2">
                                            <li>• 使用有意义的键名</li>
                                            <li>• 保持数据结构一致</li>
                                            <li>• 使用 JSON Schema 验证</li>
                                            <li>• 适当缩进提高可读性</li>
                                            <li>• 处理 null 值的情况</li>
                                            <li>• 使用标准的数据格式</li>
                                            <li>• 添加适当的注释说明</li>
                                            <li>• 使用版本控制管理 Schema</li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card className="bg-red-50 border-red-200">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-red-800 flex items-center gap-2">
                                            <AlertTriangle className="w-5 h-5" />
                                            ❌ 避免做法
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="text-sm text-red-700 space-y-2">
                                            <li>• 不要使用单引号</li>
                                            <li>• 避免最后一个元素后的逗号</li>
                                            <li>• 不要混用数据类型</li>
                                            <li>• 避免过深的嵌套</li>
                                            <li>• 不要忘记转义特殊字符</li>
                                            <li>• 避免使用函数或 undefined</li>
                                            <li>• 不要忽略错误处理</li>
                                            <li>• 避免硬编码敏感信息</li>
                                        </ul>
                                    </CardContent>
                                </Card>

                                <Card className="bg-blue-50 border-blue-200">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                                            <Shield className="w-5 h-5" />
                                            🔒 安全建议
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="text-sm text-blue-700 space-y-2">
                                            <li>• 验证所有输入数据</li>
                                            <li>• 使用 HTTPS 传输</li>
                                            <li>• 限制数据大小</li>
                                            <li>• 防止 JSON 注入攻击</li>
                                            <li>• 使用安全的解析器</li>
                                            <li>• 定期更新依赖库</li>
                                            <li>• 实施访问控制</li>
                                            <li>• 监控异常行为</li>
                                        </ul>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* 使用说明 */}
                        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h3 className="font-semibold text-slate-800 mb-2">使用说明：</h3>
                            <ul className="text-sm text-slate-700 space-y-1">
                                <li>• 点击代码示例右上角的复制按钮可以复制 JSON 代码</li>
                                <li>• 每个示例都包含详细的说明和注释</li>
                                <li>• 可以通过不同的标签页学习不同难度的内容</li>
                                <li>• 建议从基础语法开始，逐步学习高级应用</li>
                                <li>• 实际使用中建议配合验证工具确保数据正确性</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}