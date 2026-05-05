# PythonAnywhere Deployment Guide

## Steps to Deploy NeuroScan AI Backend on PythonAnywhere

### 1. Create a PythonAnywhere Account
- Go to https://www.pythonanywhere.com
- Sign up for a free account (no credit card needed)

### 2. Set Up Web App
1. In PythonAnywhere dashboard, click "Web" in the top menu
2. Click "Add a new web app"
3. Choose "Manual configuration"
4. Select **Python 3.11**

### 3. Clone Your Repository
1. Open a **Bash console** in PythonAnywhere
2. Run:
```bash
cd ~
git clone https://github.com/Raphael-80/NeuroScanAI-2.git
cd NeuroScanAI_2
pip install -r requirements.txt
```

### 4. Configure WSGI File
1. In Web app settings, find the WSGI configuration file
2. Open `/var/www/YOUR_USERNAME_pythonanywhere_com_wsgi.py`
3. Replace the entire content with:
```python
import sys
import os
project_home = '/home/YOUR_USERNAME/NeuroScanAI_2'
sys.path.insert(0, project_home)
from app import app as application
```
(Replace `YOUR_USERNAME` with your PythonAnywhere username)

### 5. Set Static/Media Files
- Static files: `/home/YOUR_USERNAME/NeuroScanAI_2/static`
- Media files: `/home/YOUR_USERNAME/NeuroScanAI_2/media`
(If these dirs don't exist, leave blank)

### 6. Reload Web App
- Click the green "Reload" button next to your web app

### 7. Test Your API
Your backend will be live at: `https://YOUR_USERNAME.pythonanywhere.com`

Test endpoints:
- Health check: `https://YOUR_USERNAME.pythonanywhere.com/health`
- Prediction: `POST https://YOUR_USERNAME.pythonanywhere.com/api/predict`

### 8. Update Frontend
In your React frontend, update the API base URL:
```javascript
const API_URL = 'https://YOUR_USERNAME.pythonanywhere.com';
```

---

## Troubleshooting
- **500 errors**: Check error logs in "Web" → "Error log"
- **Module not found**: Install packages via Bash console: `pip install package_name`
- **Model file not found**: Ensure `best_model_2.tflite` is in `/home/YOUR_USERNAME/NeuroScanAI_2/`

## Free Tier Limits
- ✅ Free forever
- ✅ 100MB disk space (should be enough)
- ✅ CPU time limits (fair use policy)
- ⚠️ May go to sleep after inactivity (reload manually if needed)

For always-on service, upgrade to Beginner ($5/month) plan.
