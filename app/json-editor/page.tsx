"use client";

import React, { useState, useCallback } from 'react';
import { Copy, Download, Eye, EyeOff, Code, FileText, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface JsonField {
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
}

export default function JsonEditor() {
  const [jsonFields, setJsonFields] = useState<JsonField[]>([
    { key: '', value: '', type: 'string' }
  ]);
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [showJson, setShowJson] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const updateJsonOutput = useCallback(() => {
    try {
      const jsonObject: Record<string, unknown> = {};
      
      jsonFields.forEach(field => {
        if (field.key.trim()) {
          let value: unknown = field.value.trim();
          
          // 根据类型转换值
          switch (field.type) {
            case 'number':
              value = parseFloat(value as string) || 0;
              break;
            case 'boolean':
              value = (value as string).toLowerCase() === 'true';
              break;
            case 'object':
              try {
                value = value ? JSON.parse(value as string) : {};
              } catch {
                value = {};
              }
              break;
            case 'array':
              try {
                value = value ? JSON.parse(value as string) : [];
              } catch {
                value = [];
              }
              break;
            default:
              // string 类型保持原样
              break;
          }
          
          jsonObject[field.key] = value;
        }
      });
      
      const formattedJson = JSON.stringify(jsonObject, null, 2);
      setJsonOutput(formattedJson);
      setIsValid(true);
    } catch {
      setJsonOutput('JSON 格式错误');
      setIsValid(false);
    }
  }, [jsonFields]);

  React.useEffect(() => {
    updateJsonOutput();
  }, [jsonFields, updateJsonOutput]);

  const addField = () => {
    setJsonFields([...jsonFields, { key: '', value: '', type: 'string' }]);
  };

  const removeField = (index: number) => {
    if (jsonFields.length > 1) {
      setJsonFields(jsonFields.filter((_, i) => i !== index));
    }
  };

  const updateField = (index: number, field: Partial<JsonField>) => {
    const updated = jsonFields.map((f, i) => 
      i === index ? { ...f, ...field } : f
    );
    setJsonFields(updated);
  };

  const copyJsonToClipboard = async () => {
    if (jsonOutput && isValid) {
      try {
        await navigator.clipboard.writeText(jsonOutput);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error('复制失败:', err);
        alert('复制失败，请手动选择复制');
      }
    }
  };

  const downloadJsonFile = () => {
    if (jsonOutput && isValid) {
      const blob = new Blob([jsonOutput], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'generated.json';
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const loadExampleJson = () => {
    const example = [
      { key: 'name', value: '张三', type: 'string' as const },
      { key: 'age', value: '25', type: 'number' as const },
      { key: 'isActive', value: 'true', type: 'boolean' as const },
      { key: 'hobbies', value: '["读书", "游泳", "编程"]', type: 'array' as const },
      { key: 'address', value: '{"city": "北京", "district": "朝阳区"}', type: 'object' as const }
    ];
    setJsonFields(example);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <Card className="border-slate-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-slate-400 to-gray-400 text-white rounded-t-lg">
            <CardTitle className="text-3xl font-bold">JSON 编辑器</CardTitle>
            <CardDescription className="text-slate-200">通过表单输入创建 JSON 对象，支持多种数据类型</CardDescription>
          </CardHeader>
          <CardContent>
            
            {/* 表单区域 */}
            <div className="mb-8 mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-700">JSON 字段编辑</h2>
                <div className="flex gap-2">
                  <Button
                    onClick={loadExampleJson}
                    variant="outline"
                    size="sm"
                    className="border-slate-300 text-slate-600 hover:bg-slate-100"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    加载示例
                  </Button>
                  <Button
                    onClick={addField}
                    variant="outline"
                    size="sm"
                    className="border-slate-300 text-slate-600 hover:bg-slate-100"
                  >
                    + 添加字段
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {jsonFields.map((field, index) => (
                  <Card key={index} className="bg-slate-50 border-slate-200">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                        {/* 键名 */}
                        <div className="md:col-span-3">
                          <Label htmlFor={`key-${index}`} className="text-sm font-medium text-slate-700">
                            键名
                          </Label>
                          <Input
                            id={`key-${index}`}
                            value={field.key}
                            onChange={(e) => updateField(index, { key: e.target.value })}
                            placeholder="字段名"
                            className="mt-1"
                          />
                        </div>

                        {/* 值 */}
                        <div className="md:col-span-4">
                          <Label htmlFor={`value-${index}`} className="text-sm font-medium text-slate-700">
                            值
                          </Label>
                          {field.type === 'object' || field.type === 'array' ? (
                            <Textarea
                              id={`value-${index}`}
                              value={field.value}
                              onChange={(e) => updateField(index, { value: e.target.value })}
                              placeholder={field.type === 'object' ? '{"key": "value"}' : '["item1", "item2"]'}
                              className="mt-1 min-h-[80px]"
                            />
                          ) : (
                            <Input
                              id={`value-${index}`}
                              value={field.value}
                              onChange={(e) => updateField(index, { value: e.target.value })}
                              placeholder="字段值"
                              className="mt-1"
                            />
                          )}
                        </div>

                        {/* 类型选择 */}
                        <div className="md:col-span-2">
                          <Label htmlFor={`type-${index}`} className="text-sm font-medium text-slate-700">
                            类型
                          </Label>
                          <select
                            id={`type-${index}`}
                            value={field.type}
                            onChange={(e) => updateField(index, { type: e.target.value as JsonField['type'] })}
                            className="mt-1 w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-slate-500"
                          >
                            <option value="string">字符串</option>
                            <option value="number">数字</option>
                            <option value="boolean">布尔值</option>
                            <option value="object">对象</option>
                            <option value="array">数组</option>
                          </select>
                        </div>

                        {/* 删除按钮 */}
                        <div className="md:col-span-3 flex justify-end">
                          <Button
                            onClick={() => removeField(index)}
                            variant="outline"
                            size="sm"
                            disabled={jsonFields.length === 1}
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            删除
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* JSON 预览区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* JSON 输出 */}
              <Card className="bg-slate-50 border-slate-200">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-slate-700">生成的 JSON</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setShowJson(!showJson)}
                        variant="outline"
                        size="sm"
                        className="border-slate-300 text-slate-600 hover:bg-slate-100"
                      >
                        {showJson ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        {showJson ? '隐藏' : '显示'}
                      </Button>
                      <Button
                        onClick={copyJsonToClipboard}
                        variant="outline"
                        size="sm"
                        className="border-slate-300 text-slate-600 hover:bg-slate-100"
                        disabled={!isValid}
                      >
                        {copySuccess ? <Check className="w-4 h-4 mr-1" /> : <Copy className="w-4 h-4 mr-1" />}
                        {copySuccess ? '已复制' : '复制'}
                      </Button>
                      <Button
                        onClick={downloadJsonFile}
                        variant="outline"
                        size="sm"
                        className="border-slate-300 text-slate-600 hover:bg-slate-100"
                        disabled={!isValid}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        下载
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {showJson ? (
                    <Textarea
                      value={jsonOutput}
                      readOnly
                      className={`w-full h-64 text-sm font-mono bg-white border resize-none ${
                        isValid ? 'border-slate-300' : 'border-red-300'
                      }`}
                      placeholder="生成的 JSON 将显示在这里..."
                    />
                  ) : (
                    <div className="w-full h-64 bg-slate-100 border border-slate-300 rounded-md flex items-center justify-center">
                      <div className="text-center text-slate-500">
                        <Code className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>点击&ldquo;显示&rdquo;按钮查看生成的 JSON</p>
                      </div>
                    </div>
                  )}
                  {!isValid && (
                    <p className="text-red-500 text-sm mt-2">JSON 格式有误，请检查输入</p>
                  )}
                </CardContent>
              </Card>

              {/* 使用说明 */}
              <Card className="bg-slate-50 border-slate-200">
                <CardHeader>
                  <CardTitle className="text-lg text-slate-700">使用说明</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-slate-800 mb-2">数据类型说明：</h4>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• <strong>字符串：</strong> 直接输入文本内容</li>
                        <li>• <strong>数字：</strong> 输入数值，如 123 或 45.67</li>
                        <li>• <strong>布尔值：</strong> 输入 true 或 false</li>
                        <li>• <strong>对象：</strong> 输入 JSON 格式，如 {`{"key": "value"}`}</li>
                        <li>• <strong>数组：</strong> 输入 JSON 数组格式，如 {`["item1", "item2"]`}</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-slate-800 mb-2">操作说明：</h4>
                      <ul className="text-sm text-slate-700 space-y-1">
                        <li>• 点击&ldquo;添加字段&rdquo;按钮增加新的键值对</li>
                        <li>• 点击&ldquo;删除&rdquo;按钮移除不需要的字段</li>
                        <li>• 点击&ldquo;复制&rdquo;按钮将 JSON 复制到剪贴板</li>
                        <li>• 点击&ldquo;下载&rdquo;按钮保存 JSON 文件</li>
                        <li>• 点击&ldquo;加载示例&rdquo;查看示例数据</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
