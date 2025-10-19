"use client";

import React, { useState, useRef } from 'react';
import { PDFDocument } from 'pdf-lib';
import { Upload, Trash2, Download, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export default function ImageToPdfConverter() {
    const [images, setImages] = useState<{ id: number; src: string; name: string }[]>([]);
    const [isDragOver, setIsDragOver] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
                        name: file.name
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

    const moveImageUp = (index: number) => {
        setImages(prev => {
            if (index <= 0 || index >= prev.length) return prev;
            const newImages = [...prev];
            [newImages[index], newImages[index - 1]] = [newImages[index - 1], newImages[index]];
            return newImages;
        });
    };

    const moveImageDown = (index: number) => {
        setImages(prev => {
            if (index < 0 || index >= prev.length - 1) return prev;
            const newImages = [...prev];
            [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
            return newImages;
        });
    };

    const generatePdf = async () => {
        if (images.length === 0) {
            alert('请至少上传一张图片');
            return;
        }

        const pdfDoc = await PDFDocument.create();
        let standardWidth = 0;
        let standardHeight = 0;
        let hasDifferentSizes = false;

        // 按顺序处理所有图片，确保每张图片都被正确处理
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            
            try {
                // 加载图片
                const img = await new Promise<HTMLImageElement>((resolve, reject) => {
                    const imageElement = new window.Image();
                    imageElement.crossOrigin = 'anonymous';
                    imageElement.onload = () => resolve(imageElement);
                    imageElement.onerror = () => reject(new Error(`Failed to load image ${i}`));
                    imageElement.src = image.src;
                });

                // 第一张图片作为标准尺寸
                if (i === 0) {
                    standardWidth = img.width;
                    standardHeight = img.height;
                } else {
                    // 检查后续图片是否与标准尺寸不同
                    if (img.width !== standardWidth || img.height !== standardHeight) {
                        hasDifferentSizes = true;
                    }
                }

                // 创建canvas，使用标准尺寸，无边框
                const canvas = document.createElement('canvas');
                canvas.width = standardWidth;
                canvas.height = standardHeight;
                const ctx = canvas.getContext('2d');
                
                if (!ctx) {
                    console.error('Failed to get canvas context for image', i);
                    continue;
                }

                // 启用图像平滑以提高渲染质量
                ctx.imageSmoothingEnabled = true;
                ctx.imageSmoothingQuality = 'high';

                // 计算图片在标准尺寸canvas中的位置和大小
                // 保持图片比例，居中显示
                const imgRatio = img.width / img.height;
                const canvasRatio = standardWidth / standardHeight;
                
                let drawWidth, drawHeight, drawX, drawY;
                
                if (imgRatio > canvasRatio) {
                    // 图片更宽，以宽度为准
                    drawWidth = standardWidth;
                    drawHeight = standardWidth / imgRatio;
                    drawX = 0;
                    drawY = (standardHeight - drawHeight) / 2;
                } else {
                    // 图片更高，以高度为准
                    drawHeight = standardHeight;
                    drawWidth = standardHeight * imgRatio;
                    drawX = (standardWidth - drawWidth) / 2;
                    drawY = 0;
                }

                // 绘制图片到标准尺寸的canvas上
                ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

                // 将canvas转换为数据URL - 使用最高质量PNG
                const dataUrl = canvas.toDataURL('image/png', 1.0);
                
                // 直接转换为PDF页面
                const arrayBuffer = await fetch(dataUrl).then(r => r.arrayBuffer());
                const uint8 = new Uint8Array(arrayBuffer);
                
                // 根据图片格式嵌入
                const isJpeg = dataUrl.includes('image/jpeg') || dataUrl.includes('image/jpg');
                const embeddedImage = isJpeg
                    ? await pdfDoc.embedJpg(uint8)
                    : await pdfDoc.embedPng(uint8);

                // 创建页面，使用标准尺寸
                const page = pdfDoc.addPage([standardWidth, standardHeight]);
                
                // 绘制图片，完全填充页面，无边框
                page.drawImage(embeddedImage, {
                    x: 0,
                    y: 0,
                    width: standardWidth,
                    height: standardHeight,
                });

                console.log(`Processed image ${i + 1}/${images.length}`);
            } catch (err) {
                console.error('Failed to process image', i, err);
            }
        }

        // 如果有不同尺寸的图片，提醒用户
        if (hasDifferentSizes) {
            alert(`注意：检测到图片尺寸不一致。所有图片已按照第一张图片的尺寸（${standardWidth} x ${standardHeight}）进行统一处理。`);
        }

        // 所有图片处理完后下载PDF
        downloadPdf(pdfDoc);
    };

    const downloadPdf = async (pdfDoc: PDFDocument) => {
        try {
            const pdfBytes = await pdfDoc.save();
            const blob = new Blob([pdfBytes.slice().buffer], { type: 'application/pdf' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'images.pdf';
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Failed to download PDF', err);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <Card className="border-slate-200 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-slate-400 to-gray-400 text-white rounded-t-lg">
                        <CardTitle className="text-3xl font-bold">多张图片转 PDF</CardTitle>
                        <CardDescription className="text-slate-200">支持排序，智能调整尺寸</CardDescription>
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
                                <span className="text-slate-600 font-semibold text-lg mb-2">
                                    {isDragOver ? '释放文件以上传' : '点击上传或拖拽图片'}
                                </span>
                                <span className="text-slate-500 text-center max-w-md">如果图片尺寸不一致，会自动调整到和第一张图片一致</span>
                                <span className="text-sm text-slate-400 mt-2 bg-slate-100 px-3 py-1 rounded-md">支持 JPG, PNG, GIF 等格式</span>
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
                                                <p className="text-sm text-slate-500">第 {index + 1} 张图片</p>
                                            </div>
                                        </CardContent>

                                        <div className="flex gap-2 p-4">
                                            <Button
                                                onClick={() => moveImageUp(index)}
                                                disabled={index === 0}
                                                variant="outline"
                                                size="icon"
                                                className="border-slate-300 text-slate-500 hover:bg-slate-100 hover:border-slate-400"
                                                title="上移"
                                            >
                                                <ArrowUp className="w-4 h-4" />
                                            </Button>

                                            <Button
                                                onClick={() => moveImageDown(index)}
                                                disabled={index === images.length - 1}
                                                variant="outline"
                                                size="icon"
                                                className="border-slate-300 text-slate-500 hover:bg-slate-100 hover:border-slate-400"
                                                title="下移"
                                            >
                                                <ArrowDown className="w-4 h-4" />
                                            </Button>

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

                    {/* 下载按钮 */}
                    <Button
                        onClick={generatePdf}
                        className="w-full bg-gradient-to-r from-slate-500 to-gray-500 hover:from-slate-600 hover:to-gray-600 text-white font-semibold"
                        size="lg"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        生成 PDF
                    </Button>

                    {/* 隐藏的 canvas */}
                    <canvas ref={canvasRef} style={{ display: 'none' }} />

                    {/* 使用说明 */}
                    <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h3 className="font-semibold text-slate-800 mb-2">使用说明：</h3>
                        <ul className="text-sm text-slate-700 space-y-1">
                            <li>• 支持上传多张图片并合并为单个 PDF 文件</li>
                            <li>• 支持 JPG、PNG、GIF 等常见图片格式</li>
                            <li>• 可以拖拽调整图片顺序，控制 PDF 中的页面顺序</li>
                            <li>• 自动统一图片尺寸，以第一张图片的尺寸为标准</li>
                            <li>• 生成的 PDF 保持高质量，适合打印和分享</li>
                            <li>• 支持删除不需要的图片，重新排序后生成 PDF</li>
                        </ul>
                    </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}