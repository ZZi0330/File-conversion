"use client";

import React, { useState } from 'react';
import { Upload, Trash2, Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

export default function PdfToJpgConverter() {
    const [pdfFile, setPdfFile] = useState<File | null>(null);
    const [images, setImages] = useState<{ id: number; src: string; pageNumber: number }[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);

    const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        processPdfFile(file);
    };

    const processPdfFile = (file: File | undefined) => {
        if (file && file.type === 'application/pdf') {
            setPdfFile(file);
            setImages([]); // 清空之前的图片
        } else if (file) {
            alert('请选择有效的PDF文件');
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
        processPdfFile(file);
    };

    const removeImage = (id: number) => {
        setImages(prev => prev.filter(img => img.id !== id));
    };

    const convertPdfToImages = async () => {
        if (!pdfFile) {
            alert('请先上传PDF文件');
            return;
        }

        setIsProcessing(true);
        
        try {
            // 动态导入pdfjs-dist
            const pdfjsLib = await import('pdfjs-dist');
            
            // 设置worker - 使用本地文件
            pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

            const arrayBuffer = await pdfFile.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            
            const newImages: { id: number; src: string; pageNumber: number }[] = [];

            for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale: 3.0 }); // 提高缩放倍数到3倍以保持更高质量
                
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                if (context) {
                    // 启用图像平滑以提高渲染质量
                    context.imageSmoothingEnabled = true;
                    context.imageSmoothingQuality = 'high';

                    await page.render({
                        canvasContext: context,
                        viewport: viewport,
                        canvas: canvas
                    }).promise;

                    // 使用PNG格式保持最高质量，避免JPEG压缩损失
                    const dataUrl = canvas.toDataURL('image/png', 1.0);
                    newImages.push({
                        id: Date.now() + Math.random() + pageNum,
                        src: dataUrl,
                        pageNumber: pageNum
                    });
                }
            }

            setImages(newImages);
        } catch (error) {
            console.error('PDF转换失败:', error);
            alert('PDF转换失败，请检查文件是否损坏');
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadImage = (image: { id: number; src: string; pageNumber: number }) => {
        const link = document.createElement('a');
        link.href = image.src;
        link.download = `page-${image.pageNumber}.png`;
        link.click();
    };

    const downloadAllImages = () => {
        images.forEach((image, index) => {
            setTimeout(() => {
                downloadImage(image);
            }, index * 100); // 延迟下载避免浏览器阻止多个下载
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <Card className="border-slate-200 shadow-lg">
                    <CardHeader className="bg-gradient-to-r from-slate-400 to-gray-400 text-white rounded-t-lg">
                        <CardTitle className="text-3xl font-bold">PDF 转图片</CardTitle>
                        <CardDescription className="text-slate-200">支持将PDF页面转换为高质量PNG图片</CardDescription>
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
                                    {isDragOver ? '释放文件以上传' : '点击上传或拖拽PDF文件'}
                                </span>
                                <span className="text-slate-500 text-center max-w-md">支持将PDF的每一页转换为高质量的PNG图片</span>
                                <span className="text-sm text-slate-400 mt-2 bg-slate-100 px-3 py-1 rounded-md">支持标准PDF格式</span>
                                <Input
                                    type="file"
                                    accept=".pdf,application/pdf"
                                    onChange={handlePdfUpload}
                                    className="hidden"
                                />
                            </label>
                        </CardContent>
                    </Card>

                    {/* PDF文件信息 */}
                    {pdfFile && (
                        <Card className="mb-6 bg-slate-50 border-slate-200">
                            <CardContent className="flex items-center gap-4 p-4">
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-red-600" />
                                </div>
                                <div className="flex-1">
                                    <p className="font-medium text-slate-700">{pdfFile.name}</p>
                                    <p className="text-sm text-slate-500">{(pdfFile.size / 1024 / 1024).toFixed(2)} MB</p>
                                </div>
                                <Button
                                    onClick={convertPdfToImages}
                                    disabled={isProcessing}
                                    className="bg-gradient-to-r from-slate-500 to-gray-500 hover:from-slate-600 hover:to-gray-600 text-white"
                                >
                                    {isProcessing ? '转换中...' : '开始转换'}
                                </Button>
                            </CardContent>
                        </Card>
                    )}

                    {/* 图片列表 */}
                    {images.length > 0 && (
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-slate-700">
                                    转换结果 ({images.length} 张图片)
                                </h2>
                                <Button
                                    onClick={downloadAllImages}
                                    variant="outline"
                                    className="border-slate-300 text-slate-600 hover:bg-slate-100"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    下载全部
                                </Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {images.map((image) => (
                                    <Card
                                        key={image.id}
                                        className="bg-slate-50 hover:bg-slate-100 hover:shadow-md transition-all border-slate-200"
                                    >
                                        <CardContent className="p-4">
                                            <div className="relative mb-3">
                                                <Image
                                                    src={image.src}
                                                    alt={`Page ${image.pageNumber}`}
                                                    width={300}
                                                    height={192}
                                                    className="w-full h-48 object-cover rounded-md border"
                                                />
                                                <div className="absolute top-2 left-2 w-8 h-8 bg-slate-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                                                    {image.pageNumber}
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium text-slate-700">第 {image.pageNumber} 页</p>
                                                    <p className="text-sm text-slate-500">PNG 格式</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => downloadImage(image)}
                                                        variant="outline"
                                                        size="sm"
                                                        className="border-slate-300 text-slate-600 hover:bg-slate-100"
                                                    >
                                                        <Download className="w-4 h-4 mr-1" />
                                                        下载
                                                    </Button>
                                                    <Button
                                                        onClick={() => removeImage(image.id)}
                                                        variant="destructive"
                                                        size="sm"
                                                        title="删除"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 处理状态 */}
                    {isProcessing && (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center gap-2 text-slate-600">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-600"></div>
                                正在处理PDF文件，请稍候...
                            </div>
                        </div>
                    )}

                    {/* 转换按钮 */}
                    {pdfFile && !isProcessing && (
                        <Button
                            onClick={convertPdfToImages}
                            className="w-full bg-gradient-to-r from-slate-500 to-gray-500 hover:from-slate-600 hover:to-gray-600 text-white font-semibold"
                            size="lg"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            转换PDF为PNG图片
                        </Button>
                    )}

                    {/* 使用说明 */}
                    <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <h3 className="font-semibold text-slate-800 mb-2">使用说明：</h3>
                        <ul className="text-sm text-slate-700 space-y-1">
                            <li>• 支持上传 PDF 文件并转换为高质量 PNG 图片</li>
                            <li>• 每页 PDF 会生成一张对应的 PNG 图片</li>
                            <li>• 转换后的图片保持高分辨率，适合打印和编辑</li>
                            <li>• 可以单独下载每张图片或批量下载全部图片</li>
                            <li>• 支持删除不需要的页面图片</li>
                        </ul>
                    </div>

                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
