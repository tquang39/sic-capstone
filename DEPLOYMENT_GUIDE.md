# Hướng dẫn Deploy Game Recommendation App

## 🚀 Cách 1: Deploy lên Vercel + Railway (Khuyến nghị)

### Bước 1: Deploy Backend lên Railway

1. **Tạo tài khoản Railway**
   - Truy cập https://railway.app
   - Đăng ký bằng GitHub

2. **Deploy Backend**
   ```bash
   # Clone repo về máy (nếu chưa có)
   git clone <your-repo-url>
   cd SIC_CAPSTONE/backend
   
   # Push lên GitHub
   git add .
   git commit -m "Add deployment files"
   git push origin main
   ```

3. **Trên Railway Dashboard**
   - Click "New Project" → "Deploy from GitHub repo"
   - Chọn repo của bạn
   - Chọn thư mục `backend`
   - Railway sẽ tự động detect Python và deploy

4. **Cấu hình Environment Variables**
   - Vào tab "Variables"
   - Thêm các biến môi trường:
     ```
     JWT_SECRET_KEY=your-secret-key-here
     GOOGLE_SHEETS_CREDENTIALS_PATH=credentials.json
     GOOGLE_SHEETS_ID=your-sheet-id
     ```

5. **Lấy URL Backend**
   - Railway sẽ cung cấp URL như: `https://your-app.railway.app`

### Bước 2: Deploy Frontend lên Vercel

1. **Tạo tài khoản Vercel**
   - Truy cập https://vercel.com
   - Đăng ký bằng GitHub

2. **Cấu hình API URL**
   - Tạo file `.env.local` trong thư mục `Web/`:
     ```
     REACT_APP_API_URL=https://your-backend-url.railway.app/api
     ```

3. **Deploy Frontend**
   ```bash
   cd Web
   npm run build
   ```

4. **Trên Vercel Dashboard**
   - Click "New Project" → "Import Git Repository"
   - Chọn repo của bạn
   - Cấu hình:
     - Framework Preset: Create React App
     - Root Directory: `Web`
     - Build Command: `npm run build`
     - Output Directory: `build`

5. **Cấu hình Environment Variables**
   - Vào tab "Environment Variables"
   - Thêm: `REACT_APP_API_URL=https://your-backend-url.railway.app/api`

## 🚀 Cách 2: Deploy lên Render (Miễn phí)

### Backend trên Render:
1. Truy cập https://render.com
2. "New Web Service" → Connect GitHub
3. Chọn repo và thư mục `backend`
4. Cấu hình:
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn app:app`

### Frontend trên Render:
1. "New Static Site" → Connect GitHub
2. Chọn repo và thư mục `Web`
3. Build Command: `npm run build`
4. Publish Directory: `build`

## 🚀 Cách 3: Deploy lên Heroku

### Backend:
```bash
# Cài Heroku CLI
heroku create your-app-name
git push heroku main
```

### Frontend:
- Sử dụng Heroku Buildpacks cho React
- Hoặc deploy static files lên GitHub Pages

## 📝 Lưu ý quan trọng

### 1. CORS Configuration
Backend đã có CORS setup, nhưng cần cấu hình cho production:

```python
# Trong app.py
CORS(app, origins=['https://your-frontend-domain.vercel.app'])
```

### 2. Environment Variables
Đảm bảo set đúng các biến môi trường:
- `JWT_SECRET_KEY`
- `GOOGLE_SHEETS_CREDENTIALS_PATH`
- `GOOGLE_SHEETS_ID`

### 3. Database
- Hiện tại app sử dụng CSV files
- Cho production, nên migrate sang PostgreSQL hoặc MongoDB

### 4. Security
- Thay đổi `JWT_SECRET_KEY` mặc định
- Cấu hình HTTPS
- Rate limiting cho API

## 🔧 Troubleshooting

### Lỗi thường gặp:
1. **CORS Error**: Kiểm tra origins trong CORS config
2. **Build Failed**: Kiểm tra requirements.txt và Python version
3. **API Connection**: Kiểm tra REACT_APP_API_URL

### Debug:
```bash
# Backend logs
railway logs

# Frontend build logs
vercel logs
```

## 🌐 Sau khi deploy

1. **Test API**: `https://your-backend.railway.app/api/health`
2. **Test Frontend**: Truy cập URL Vercel
3. **Share URL**: Gửi link cho mọi người!

## 💰 Chi phí

- **Vercel**: Miễn phí (100GB bandwidth/tháng)
- **Railway**: Miễn phí (500 hours/tháng)
- **Render**: Miễn phí (750 hours/tháng)

Tổng chi phí: **$0** cho personal projects! 