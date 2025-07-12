# Almstkshf Manager | مدير المستكشف

<div align="center">
  <p align="center">
    <a href="#english">English</a> |
    <a href="#arabic">العربية</a>
  </p>
</div>

---

<a name="english"></a>
## Project Overview

Almstkshf Manager is a comprehensive project management application designed to streamline task management, project tracking, and team collaboration. Built with React, TypeScript, and Firebase, it offers a modern, responsive interface with AI-powered insights to help teams work more efficiently.

### Key Features

- **User Authentication & Authorization**
  - Secure login, registration, and password reset
  - Role-based permissions (Admin, Project Manager, Team Member)
  - User invitation system

- **Project Management**
  - Create, edit, and archive projects
  - Track project timelines and budgets
  - Visualize project progress

- **Task Management**
  - Create and assign tasks with priorities and deadlines
  - Track task status and dependencies
  - Comment on tasks with sentiment analysis

- **Personal Todo Lists**
  - Create and manage personal to-do items
  - Set due dates and track completion

- **AI-Powered Features**
  - Generate project insights and recommendations
  - Analyze task comments for sentiment
  - Generate meeting agendas
  - Suggest project ideas

- **Notifications & Activity Tracking**
  - Real-time notifications
  - Activity logging for audit purposes

- **Multilingual Support**
  - English and Arabic interfaces

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account

### Setup

1. Clone the repository
   ```
   git clone https://github.com/yourusername/almstkshf-manager.git
   cd almstkshf-manager
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Firebase configuration (copy from `.env.example`):
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. Create a `.env` file in the `functions` directory with your Gemini API key (copy from `functions/.env.example`):
   ```
   API_KEY=your_gemini_api_key
   ```

5. Start the development server
   ```
   npm run dev
   ```

## Deployment

To deploy the application to Firebase:

```
npm run deploy
```

For detailed deployment instructions, see the [Deployment Guide](./docs/DeploymentGuide.md).

If you encounter any issues during deployment, refer to the [Troubleshooting Guide](./docs/TroubleshootingGuide.md).

## Testing

### Unit Tests

Run Jest unit tests:
```
npm test
```

Run tests with coverage:
```
npm run test:coverage
```

### E2E Tests

Open Cypress test runner:
```
npm run cypress:open
```

Run Cypress tests headlessly:
```
npm run cypress:run
```

## Deployment

1. Build the application
   ```
   npm run build
   ```

2. Deploy to Firebase
   ```
   npm run deploy
   ```

---

<a name="arabic"></a>
## نظرة عامة على المشروع

مدير المستكشف هو تطبيق شامل لإدارة المشاريع مصمم لتبسيط إدارة المهام وتتبع المشاريع والتعاون بين الفرق. تم بناؤه باستخدام React وTypeScript وFirebase، ويوفر واجهة حديثة ومتجاوبة مع رؤى مدعومة بالذكاء الاصطناعي لمساعدة الفرق على العمل بكفاءة أكبر.

### الميزات الرئيسية

- **المصادقة والتفويض**
  - تسجيل الدخول الآمن والتسجيل وإعادة تعيين كلمة المرور
  - أذونات قائمة على الأدوار (مدير، مدير مشروع، عضو فريق)
  - نظام دعوة المستخدمين

- **إدارة المشاريع**
  - إنشاء وتحرير وأرشفة المشاريع
  - تتبع الجداول الزمنية للمشاريع والميزانيات
  - تصور تقدم المشروع

- **إدارة المهام**
  - إنشاء وتعيين المهام مع الأولويات والمواعيد النهائية
  - تتبع حالة المهام والتبعيات
  - التعليق على المهام مع تحليل المشاعر

- **قوائم المهام الشخصية**
  - إنشاء وإدارة العناصر الشخصية المطلوب إنجازها
  - تعيين مواعيد الاستحقاق وتتبع الإكمال

- **ميزات مدعومة بالذكاء الاصطناعي**
  - توليد رؤى وتوصيات للمشروع
  - تحليل تعليقات المهام للمشاعر
  - إنشاء جداول أعمال الاجتماعات
  - اقتراح أفكار المشاريع

- **الإشعارات وتتبع النشاط**
  - إشعارات في الوقت الحقيقي
  - تسجيل النشاط لأغراض التدقيق

- **دعم متعدد اللغات**
  - واجهات باللغتين الإنجليزية والعربية

## التثبيت

### المتطلبات الأساسية

- Node.js (الإصدار 16 أو أعلى)
- npm أو yarn
- حساب Firebase

### الإعداد

1. استنساخ المستودع
   ```
   git clone https://github.com/yourusername/almstkshf-manager.git
   cd almstkshf-manager
   ```

2. تثبيت التبعيات
   ```
   npm install
   ```

3. إنشاء ملف `.env.local` في الدليل الجذر مع تكوين Firebase الخاص بك:
   ```
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. بدء خادم التطوير
   ```
   npm run dev
   ```

## الاختبار

### اختبارات الوحدة

تشغيل اختبارات Jest للوحدة:
```
npm test
```

تشغيل الاختبارات مع التغطية:
```
npm run test:coverage
```

### اختبارات E2E

فتح مشغل اختبار Cypress:
```
npm run cypress:open
```

تشغيل اختبارات Cypress بدون واجهة:
```
npm run cypress:run
```

## النشر

1. بناء التطبيق
   ```
   npm run build
   ```

2. النشر إلى Firebase
   ```
   npm run deploy
   ```
