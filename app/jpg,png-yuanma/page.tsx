"use client";

import React, { useState } from 'react';
import { Upload, Copy, Download, Eye, EyeOff, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Image from 'next/image';

export default function ImageBase64Viewer() {
    const [image, setImage] = useState<{ 
        src: string; 
        name: string; 
        base64: string; 
        originalBase64?: string;
        size: number; 
        actualFormat?: string 
    } | null>(null);
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
            // 读取文件的二进制数据来检测真实格式
            const arrayBufferReader = new FileReader();
            arrayBufferReader.onload = (event) => {
                const arrayBuffer = event.target?.result as ArrayBuffer;
                const uint8Array = new Uint8Array(arrayBuffer);
                const actualFormat = detectImageFormat(uint8Array);

                // 读取为 Base64
                const base64Reader = new FileReader();
                base64Reader.onload = (base64Event) => {
                    const originalResult = base64Event.target?.result as string;
                    
                    // 根据实际格式修正Base64的MIME类型
                    let correctedBase64 = originalResult;
                    if (actualFormat !== 'Unknown') {
                        const base64Data = originalResult.split(',')[1]; // 获取纯Base64数据
                        const correctMimeType = getMimeTypeFromFormat(actualFormat);
                        correctedBase64 = `data:${correctMimeType};base64,${base64Data}`;
                    }
                    
                    setImage({
                        src: correctedBase64, // 使用修正后的Base64作为显示源
                        name: file.name,
                        base64: correctedBase64, // 使用修正后的Base64
                        originalBase64: originalResult, // 保存原始的Base64（基于文件扩展名的）
                        size: file.size,
                        actualFormat: actualFormat
                    });
                };
                base64Reader.readAsDataURL(file);
            };
            arrayBufferReader.readAsArrayBuffer(file);
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

    // 根据格式获取正确的MIME类型
    const getMimeTypeFromFormat = (format: string): string => {
        switch (format.toLowerCase()) {
            case 'jpeg':
                return 'image/jpeg';
            case 'png':
                return 'image/png';
            case 'gif':
                return 'image/gif';
            case 'webp':
                return 'image/webp';
            case 'bmp':
                return 'image/bmp';
            default:
                return 'image/jpeg'; // 默认
        }
    };

    // 通过文件头检测真实的图片格式
    const detectImageFormat = (uint8Array: Uint8Array): string => {
        // PNG 文件头: 89 50 4E 47 0D 0A 1A 0A
        if (uint8Array.length >= 8 &&
            uint8Array[0] === 0x89 && uint8Array[1] === 0x50 &&
            uint8Array[2] === 0x4E && uint8Array[3] === 0x47 &&
            uint8Array[4] === 0x0D && uint8Array[5] === 0x0A &&
            uint8Array[6] === 0x1A && uint8Array[7] === 0x0A) {
            return 'PNG';
        }

        // JPEG 文件头: FF D8 FF
        if (uint8Array.length >= 3 &&
            uint8Array[0] === 0xFF && uint8Array[1] === 0xD8 && uint8Array[2] === 0xFF) {
            return 'JPEG';
        }

        // GIF 文件头: 47 49 46 38 (GIF8)
        if (uint8Array.length >= 4 &&
            uint8Array[0] === 0x47 && uint8Array[1] === 0x49 &&
            uint8Array[2] === 0x46 && uint8Array[3] === 0x38) {
            return 'GIF';
        }

        // WebP 文件头: 52 49 46 46 ... 57 45 42 50 (RIFF...WEBP)
        if (uint8Array.length >= 12 &&
            uint8Array[0] === 0x52 && uint8Array[1] === 0x49 &&
            uint8Array[2] === 0x46 && uint8Array[3] === 0x46 &&
            uint8Array[8] === 0x57 && uint8Array[9] === 0x45 &&
            uint8Array[10] === 0x42 && uint8Array[11] === 0x50) {
            return 'WebP';
        }

        // BMP 文件头: 42 4D (BM)
        if (uint8Array.length >= 2 &&
            uint8Array[0] === 0x42 && uint8Array[1] === 0x4D) {
            return 'BMP';
        }

        return 'Unknown';
    };

    const checkFormatMismatch = (fileName: string, actualFormat: string): { isMismatch: boolean; warning: string } => {
        const fileExtension = fileName.toLowerCase().split('.').pop();
        const actualFormatLower = actualFormat.toLowerCase();

        if (fileExtension === 'png' && actualFormatLower === 'jpeg') {
            return {
                isMismatch: true,
                warning: '⚠️ 警告：文件扩展名是 .png，但实际格式是 JPEG！这是一个假的 PNG 文件。'
            };
        } else if ((fileExtension === 'jpg' || fileExtension === 'jpeg') && actualFormatLower === 'png') {
            return {
                isMismatch: true,
                warning: '⚠️ 注意：文件扩展名是 .jpg，但实际格式是 PNG。'
            };
        } else if (fileExtension === 'gif' && actualFormatLower !== 'gif') {
            return {
                isMismatch: true,
                warning: `⚠️ 警告：文件扩展名是 .gif，但实际格式是 ${actualFormat}！`
            };
        } else if (fileExtension === 'webp' && actualFormatLower !== 'webp') {
            return {
                isMismatch: true,
                warning: `⚠️ 警告：文件扩展名是 .webp，但实际格式是 ${actualFormat}！`
            };
        } else if (fileExtension === 'bmp' && actualFormatLower !== 'bmp') {
            return {
                isMismatch: true,
                warning: `⚠️ 警告：文件扩展名是 .bmp，但实际格式是 ${actualFormat}！`
            };
        }

        return { isMismatch: false, warning: '' };
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
                            className={`mb-10 mt-10 border-2 border-dashed transition-colors ${isDragOver
                                ? 'border-slate-500 bg-slate-200'
                                : 'border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-slate-400'
                                }`}
                            onDragOver={handleDragOver}
                            onDragLeave={handleDragLeave}
                            onDrop={handleDrop}
                        >
                            <CardContent className="p-8">
                                <label className="cursor-pointer flex flex-col items-center justify-center">
                                    <div className={`w-16 h-16 rounded-lg flex items-center justify-center mb-4 transition-colors ${isDragOver ? 'bg-slate-500' : 'bg-slate-400'
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
                                                    <span className="font-medium">文件扩展名格式：</span>{image.originalBase64 ? getImageFormat(image.originalBase64) : 'Unknown'}
                                                </p>
                                                <p className="text-sm text-slate-600">
                                                    <span className="font-medium">实际格式：</span>{image.actualFormat || 'Unknown'}
                                                </p>
                                                <p className="text-sm text-slate-600">
                                                    <span className="font-medium">修正后Base64格式：</span>{getImageFormat(image.base64)}
                                                </p>
                                                <p className="text-sm text-slate-600">
                                                    <span className="font-medium">文件大小：</span>{formatFileSize(image.size)}
                                                </p>
                                                <p className="text-sm text-slate-600">
                                                    <span className="font-medium">Base64 长度：</span>{getBase64Length(image.base64).toLocaleString()} 字符
                                                </p>

                                                {/* 格式验证警告 */}
                                                {(() => {
                                                    const formatCheck = checkFormatMismatch(image.name, image.actualFormat || 'Unknown');
                                                    if (formatCheck.isMismatch) {
                                                        return (
                                                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-md">
                                                                <p className="text-sm text-red-700 font-medium">
                                                                    {formatCheck.warning}
                                                                </p>
                                                                <p className="text-xs text-red-600 mt-1">
                                                                    建议使用专业工具进行真正的格式转换，而不是仅仅修改文件扩展名。
                                                                </p>
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                })()}
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

                        {/* PNG格式识别说明 */}
                        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card className="bg-amber-50 border-amber-200">
                                <CardHeader>
                                    <CardTitle className="text-lg text-amber-800 flex items-center gap-2">
                                        ⚠️ PNG 格式识别
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-medium text-amber-800 mb-2">真正的 PNG 格式特征：</h4>
                                            <ul className="text-sm text-amber-700 space-y-1">
                                                <li>• Base64 开头：<code className="bg-amber-100 px-1 rounded">data:image/png;base64,</code></li>
                                                <li>• 文件头标识：PNG 文件以特定的字节序列开始</li>
                                                <li>• 支持透明度：真正的 PNG 可以有透明背景</li>
                                                <li>• 无损压缩：图片质量不会因压缩而损失</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-amber-800 mb-2">如何识别假 PNG：</h4>
                                            <ul className="text-sm text-amber-700 space-y-1">
                                                <li>• 仅改文件扩展名：.jpg 改成 .png</li>
                                                <li>• 浏览器会根据扩展名生成错误的Base64头部</li>
                                                <li>• 本工具通过文件头检测真实格式并修正Base64</li>
                                                <li>• 无透明度支持：背景仍然是白色或其他颜色</li>
                                                <li>• 压缩痕迹：可能有 JPEG 压缩的块状效应</li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-blue-50 border-blue-200">
                                <CardHeader>
                                    <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                                        💡 格式转换建议
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        <div>
                                            <h4 className="font-medium text-blue-800 mb-2">正确的转换方法：</h4>
                                            <ul className="text-sm text-blue-700 space-y-1">
                                                <li>• 使用专业图片编辑软件（如 Photoshop、GIMP）</li>
                                                <li>• 使用在线转换工具进行真正的格式转换</li>
                                                <li>• 使用编程库（如 PIL、Canvas）重新编码</li>
                                                <li>• 本站的 JPG 转 PNG 工具进行真实转换</li>
                                            </ul>
                                        </div>

                                        <div>
                                            <h4 className="font-medium text-blue-800 mb-2">验证方法：</h4>
                                            <ul className="text-sm text-blue-700 space-y-1">
                                                <li>• 查看 Base64 源码的 MIME 类型</li>
                                                <li>• 检查文件是否支持透明度</li>
                                                <li>• 使用十六进制编辑器查看文件头</li>
                                                <li>• 观察图片压缩特征和质量</li>
                                            </ul>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* 使用说明 */}
                        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h3 className="font-semibold text-slate-800 mb-2">使用说明：</h3>
                            <ul className="text-sm text-slate-700 space-y-1">
                                <li>• 支持 JPG、PNG、GIF、WebP、BMP 等常见图片格式</li>
                                <li>• 上传图片后可以查看其 Base64 编码源码</li>
                                <li>• 点击&ldquo;复制&rdquo;按钮将 Base64 源码复制到剪贴板</li>
                                <li>• 点击&ldquo;下载&rdquo;按钮将 Base64 源码保存为文本文件</li>
                                <li>• Base64 源码可用于网页、邮件、API 等场景</li>
                                <li>• 通过查看 Base64 源码可以识别图片的真实格式</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}