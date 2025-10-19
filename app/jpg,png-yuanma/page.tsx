"use client";

import React, { useState } from 'react';
import { Upload, Copy, Download, Eye, EyeOff, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

export default function ImageBase64Viewer() {
    const [image, setImage] = useState<{ src: string; name: string; base64: string; size: number } | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const [showBase64, setShowBase64] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            processFile(file);
        }
    };

    const processFile = (file: File) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const result = event.target?.result as string;
                setImage({
                    src: result,
                    name: file.name,
                    base64: result,
                    size: file.size
                });
            };
            reader.readAsDataURL(file);
        } else {
            alert('请选择有效的图片文件');
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) {
            processFile(file);
        }
    };

    const copyBase64ToClipboard = async () => {
        if (image?.base64) {
            try {
                await navigator.clipboard.writeText(image.base64);
                alert('Base64 源码已复制到剪贴板！');
            } catch (err) {
                console.error('复制失败:', err);
                alert('复制失败，请手动选择复制');
            }
        }
    };

    const downloadBase64File = () => {
        if (image?.base64) {
            const blob = new Blob([image.base64], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${image.name.replace(/\.[^/.]+$/, '')}_base64.txt`;
            link.click();
            URL.revokeObjectURL(url);
        }
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const getImageFormat = (base64: string): string => {
        if (base64.startsWith('data:image/jpeg') || base64.startsWith('data:image/jpg')) {
            return 'JPEG';
        } else if (base64.startsWith('data:image/png')) {
            return 'PNG';
        } else if (base64.startsWith('data:image/gif')) {
            return 'GIF';
        } else if (base64.startsWith('data:image/webp')) {
            return 'WebP';
        } else if (base64.startsWith('data:image/bmp')) {
            return 'BMP';
        }
        return 'Unknown';
    };

    const getBase64Length = (base64: string): number => {
        return base64.length;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <Card className="border-slate-200 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-slate-400 to-gray-400 text-white rounded-t-lg">
                        <CardTitle className="text-3xl font-bold">JPG/PNG 源码查看器</CardTitle>
                        <CardDescription className="text-slate-200">上传图片查看其 Base64 编码源码，支持复制和下载</CardDescription>
                    </CardHeader>
                    <CardContent>

                    {/* 上传区域 */}
                    <Card 
                        className={`mb-10 mt-10 border-2 border-dashed transition-colors ${
                            isDragOver 
                                ? 'border-slate-500 bg-slate-200' 
                                : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'
                        }`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                    >
                        <CardContent className="p-8">
                            <label className="cursor-pointer flex flex-col items-center justify-center">
                                <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-4 transition-colors ${
                                    isDragOver ? 'bg-slate-500' : 'bg-slate-400'
                                }`}>
                                    <Upload className="w-8 h-8 text-white" />
                                </div>
                                <span className="text-slate-700 font-semibold text-lg mb-2">
                                    {isDragOver ? '释放文件以上传' : '点击上传或拖拽图片'}
                                </span>
                                <span className="text-slate-600 text-center max-w-md">支持 JPG、PNG、GIF、WebP、BMP 等格式</span>
                                <span className="text-sm text-slate-500 mt-2 bg-slate-100 px-3 py-1 rounded-md">查看图片的 Base64 编码源码</span>
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </CardContent>
                    </Card>

                    {/* 图片预览和信息 */}
                    {image && (
                        <div className="mb-8">
                            <h2 className="text-xl font-semibold text-slate-700 mb-4">图片信息</h2>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* 图片预览 */}
                                <Card className="bg-slate-50 border-slate-200">
                                    <CardHeader>
                                        <CardTitle className="text-lg text-slate-700">图片预览</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="relative">
                                            <Image
                                                src={image.src}
                                                alt="preview"
                                                width={400}
                                                height={300}
                                                className="w-full h-64 object-contain rounded-md border bg-white"
                                            />
                                        </div>
                                        <div className="mt-4 space-y-2">
                                            <p className="text-sm text-slate-600">
                                                <span className="font-medium">文件名：</span>{image.name}
                                            </p>
                                            <p className="text-sm text-slate-600">
                                                <span className="font-medium">格式：</span>{getImageFormat(image.base64)}
                                            </p>
                                            <p className="text-sm text-slate-600">
                                                <span className="font-medium">文件大小：</span>{formatFileSize(image.size)}
                                            </p>
                                            <p className="text-sm text-slate-600">
                                                <span className="font-medium">Base64 长度：</span>{getBase64Length(image.base64).toLocaleString()} 字符
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Base64 源码 */}
                                <Card className="bg-slate-50 border-slate-200">
                                    <CardHeader>
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-lg text-slate-700">Base64 源码</CardTitle>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => setShowBase64(!showBase64)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-slate-300 text-slate-600 hover:bg-slate-100"
                                                >
                                                    {showBase64 ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                                    {showBase64 ? '隐藏' : '显示'}
                                                </Button>
                                                <Button
                                                    onClick={copyBase64ToClipboard}
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-slate-300 text-slate-600 hover:bg-slate-100"
                                                >
                                                    <Copy className="w-4 h-4 mr-1" />
                                                    复制
                                                </Button>
                                                <Button
                                                    onClick={downloadBase64File}
                                                    variant="outline"
                                                    size="sm"
                                                    className="border-slate-300 text-slate-600 hover:bg-slate-100"
                                                >
                                                    <Download className="w-4 h-4 mr-1" />
                                                    下载
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {showBase64 ? (
                                            <Textarea
                                                value={image.base64}
                                                readOnly
                                                className="w-full h-64 text-xs font-mono bg-white border border-slate-300 resize-none"
                                                placeholder="Base64 源码将显示在这里..."
                                            />
                                        ) : (
                                            <div className="w-full h-64 bg-slate-100 border border-slate-300 rounded-md flex items-center justify-center">
                                                <div className="text-center text-slate-500">
                                                    <Code className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                    <p>点击&ldquo;显示&rdquo;按钮查看 Base64 源码</p>
                                                </div>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}

                    {/* 使用说明 */}
                    <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h3 className="font-semibold text-slate-800 mb-2">使用说明：</h3>
                        <ul className="text-sm text-slate-700 space-y-1">
                            <li>• 支持 JPG、PNG、GIF、WebP、BMP 等常见图片格式</li>
                            <li>• 上传图片后可以查看其 Base64 编码源码</li>
                            <li>• 点击&ldquo;复制&rdquo;按钮将 Base64 源码复制到剪贴板</li>
                            <li>• 点击&ldquo;下载&rdquo;按钮将 Base64 源码保存为文本文件</li>
                            <li>• Base64 源码可用于网页、邮件、API 等场景</li>
                        </ul>
                    </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
