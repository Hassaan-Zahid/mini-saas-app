# **Mini SaaS System - Laravel + React + Expo (React Native)**

## **📝 Project Description**
A full-stack product management system with:
- **Laravel 12** backend API
- **React** admin dashboard
- **React Native (Expo)** mobile app
- Real-time updates via **Pusher**

## **🚀 Getting Started**

### **Prerequisites**
- PHP 8.1+
- Node.js 16+
- MySQL 5.7+
- Composer
- Expo CLI

### **Installation**
1. Clone the repo:
   ```bash
   git clone https://github.com/Hassaan-Zahid/mini-saas-app.git
   cd mini-saas-app
   ```

2. Set up backend:
   ```bash
   cd backend
   cp .env.example .env
   composer install
   php artisan key:generate
   php artisan migrate --seed
   php artisan queue:work
   php artisan serve --host=0.0.0.0 --port=8000
   ```

3. Set up frontend:
   ```bash
   cd ../front-end
   npm install
   npm start
   ```

4. Set up mobile app:
   ```bash
   cd ../mobile-app
   npm install
   npx expo start
   ```

## **🌐 Project Structure**
```
mini-saas/
├── backend/          # Laravel API
│   ├── app/
│   ├── config/
│   └── ...
├── front-end/         # React web app
│   ├── src/
│   └── ...
└── mobile-app/           # Expo app
    ├── screens/
    └── ...
```


## **🔐 Default Login Credentials**

### **User Access**
- **Email:** `user@example.com`
- **Password:** `user123`

### **Admin Access**
- **Email:** `admin@example.com`
- **Password:** `admin123`
