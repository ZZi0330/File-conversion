"use client";

import React, { useState } from 'react';
import { Upload, Trash2, Download, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export default function JpgToPngConverter() {
    const [images, setImages] = useState<{ id: number; src: string; name: string; originalFormat: string }[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const fileList = e.target.files;
        if (!fileList) return;
        const files = Array.from(fileList);
        processFiles(files);
    };

    const processFiles = (files: File[]) => {
        files.forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    setImages(prev => [...prev, {
                        id: Date.now() + Math.random(),
                        src: String(event.target?.result),
                        name: file.name,
                        originalFormat: file.type
                    }]);
                };
                reader.readAsDataURL(file);
            }
        });
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
        const files = Array.from(e.dataTransfer.files);
        processFiles(files);
    };

    const removeImage = (id: number) => {
        setImages(prev => prev.filter(img => img.id !== id));
    };

    const convertToPng = async () => {
        if (images.length === 0) {
            alert('请至少上传一张图片');
            return;
        }

        setIsProcessing(true);

        try {
            for (let i = 0; i < images.length; i++) {
                const image = images[i];

                // 创建图片元素
                const img = new window.Image();
                img.crossOrigin = 'anonymous';

                await new Promise<void>((resolve, reject) => {
                    img.onload = () => resolve();
                    img.onerror = () => reject(new Error(`Failed to load image ${i + 1}`));
                    img.src = image.src;
                });

                // 创建 canvas
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    throw new Error(`Failed to get canvas context for image ${i + 1}`);
                }

                canvas.width = img.width;
                canvas.height = img.height;

                // 绘制图片到 canvas
                ctx.drawImage(img, 0, 0);

                // 转换为 PNG 格式的 data URL
                const pngDataUrl = canvas.toDataURL('image/png', 1.0);

                // 创建下载链接
                const link = document.createElement('a');
                link.href = pngDataUrl;

                // 生成新的文件名（将扩展名改为 .png）
                const originalName = image.name.replace(/\.[^/.]+$/, '');
                link.download = `${originalName}.png`;

                // 触发下载
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                console.log(`Converted image ${i + 1}/${images.length}: ${image.name} -> ${originalName}.png`);
            }

            alert(`成功转换 ${images.length} 张图片为 PNG 格式！`);
        } catch (error) {
            console.error('Conversion failed:', error);
            alert('转换过程中出现错误，请重试');
        } finally {
            setIsProcessing(false);
        }
    };

    const convertAllToZip = async () => {
        if (images.length === 0) {
            alert('请至少上传一张图片');
            return;
        }

        setIsProcessing(true);

        try {
            // 这里可以集成 JSZip 库来创建 ZIP 文件
            alert('功能开发中，目前支持单张图片转换下载');
        } catch (error) {
            console.error('Batch conversion failed:', error);
            alert('批量转换过程中出现错误，请重试');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <Card className="border-slate-200 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-slate-400 to-gray-400 text-white rounded-t-lg">
                        <CardTitle className="text-3xl font-bold">JPG 转 PNG</CardTitle>
                        <CardDescription className="text-slate-200">支持多种图片格式转换为 PNG，保持透明度和高质量</CardDescription>
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
                                    <span className="text-slate-600 text-center max-w-md">支持 JPG、JPEG、BMP、GIF 等格式转换为 PNG</span>
                                    <span className="text-sm text-slate-500 mt-2 bg-slate-100 px-3 py-1 rounded-md">PNG 格式支持透明度，质量更高</span>
                                    <Input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            </CardContent>
                        </Card>

                        {/* 图片列表 */}
                        {images.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-xl font-semibold text-slate-700 mb-4">
                                    已上传的图片 ({images.length} 张)
                                </h2>
                                <div className="space-y-3">
                                    {images.map((image, index) => (
                                        <Card
                                            key={image.id}
                                            className="flex items-center justify-between bg-slate-50 hover:bg-slate-100 hover:shadow-md transition-all border-slate-200"
                                        >
                                            <CardContent className="flex items-center flex-1 gap-4 p-4">
                                                <div className="relative">
                                                    <Image
                                                        src={image.src}
                                                        alt="preview"
                                                        width={64}
                                                        height={64}
                                                        className="w-16 h-16 object-cover rounded-md"
                                                    />
                                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-slate-400 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                                        {index + 1}
                                                    </div>
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-medium text-slate-700">{image.name}</p>
                                                    <p className="text-sm text-slate-500">
                                                        格式: {image.originalFormat} → PNG
                                                    </p>
                                                </div>
                                            </CardContent>

                                            <div className="p-4">
                                                <Button
                                                    onClick={() => removeImage(image.id)}
                                                    variant="destructive"
                                                    size="icon"
                                                    title="删除"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* 转换按钮 */}
                        <div className="space-y-4">
                            <Button
                                onClick={convertToPng}
                                disabled={isProcessing || images.length === 0}
                                className="w-full bg-gradient-to-r from-slate-500 to-gray-500 hover:from-slate-600 hover:to-gray-600 text-white font-semibold"
                                size="lg"
                            >
                                <ImageIcon className="w-4 h-4 mr-2" />
                                {isProcessing ? '转换中...' : `转换所有图片为 PNG (${images.length} 张)`}
                            </Button>

                            {images.length > 1 && (
                                <Button
                                    onClick={convertAllToZip}
                                    disabled={isProcessing}
                                    variant="outline"
                                    className="w-full border-slate-300 text-slate-600 hover:bg-slate-50"
                                    size="lg"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    批量下载为 ZIP (开发中)
                                </Button>
                            )}
                        </div>

                        {/* 使用说明 */}
                        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                            <h3 className="font-semibold text-slate-800 mb-2">使用说明：</h3>
                            <ul className="text-sm text-slate-700 space-y-1">
                                <li>• 支持 JPG、JPEG、BMP、GIF 等格式转换为 PNG</li>
                                <li>• PNG 格式支持透明度，适合需要透明背景的图片</li>
                                <li>• 转换后的图片质量更高，文件大小可能更大</li>
                                <li>• 点击转换按钮后会逐个下载转换后的 PNG 文件</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
