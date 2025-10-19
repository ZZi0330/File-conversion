import { NextRequest, NextResponse } from 'next/server'
import nodemailer from 'nodemailer'

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json()

    // 验证必填字段
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: '所有字段都是必填的' },
        { status: 400 }
      )
    }

    // 创建邮件传输器
    const transporter = nodemailer.createTransport({
      service: 'qq',
      auth: {
        user: '1127149876@qq.com', // 您的QQ邮箱
        pass: process.env.QQ_EMAIL_PASSWORD // 需要在环境变量中设置QQ邮箱授权码
      }
    })

    // 邮件内容
    const mailOptions = {
      from: '1127149876@qq.com',
      to: '1127149876@qq.com',
      subject: `[改进意见] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            用户反馈 - 改进意见
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">用户信息</h3>
            <p><strong>姓名:</strong> ${name}</p>
            <p><strong>邮箱:</strong> ${email}</p>
            <p><strong>主题:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
            <h3 style="color: #495057; margin-top: 0;">反馈内容</h3>
            <div style="white-space: pre-wrap; line-height: 1.6;">${message}</div>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 8px; font-size: 14px; color: #6c757d;">
            <p style="margin: 0;">此邮件由文件转换器反馈系统自动发送</p>
            <p style="margin: 5px 0 0 0;">发送时间: ${new Date().toLocaleString('zh-CN')}</p>
          </div>
        </div>
      `,
      text: `
用户反馈 - 改进意见

用户信息:
姓名: ${name}
邮箱: ${email}
主题: ${subject}

反馈内容:
${message}

---
此邮件由文件转换器反馈系统自动发送
发送时间: ${new Date().toLocaleString('zh-CN')}
      `
    }

    // 发送邮件
    await transporter.sendMail(mailOptions)

    return NextResponse.json(
      { message: '反馈已成功发送！' },
      { status: 200 }
    )

  } catch (error) {
    console.error('邮件发送失败:', error)
    return NextResponse.json(
      { error: '邮件发送失败，请稍后重试' },
      { status: 500 }
    )
  }
}
