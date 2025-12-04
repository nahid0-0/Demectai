<div align="center">

# 🔍 Demectai

### AI-Powered Image Authenticity Detector

Instantly determine if an image is **human-created** or **AI-generated** using advanced deep learning.

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-demectai.vercel.app-00C7B7?style=for-the-badge)](https://demectai.vercel.app)
[![Hugging Face](https://img.shields.io/badge/🤗_Model-Hugging_Face-FFD21E?style=for-the-badge)](https://huggingface.co/spaces/nahid112376/demectai)

---

<!-- Add your screen recording GIF here -->
<!-- To create a GIF: Record your screen, then convert to GIF using: -->
<!-- https://ezgif.com/video-to-gif or https://cloudconvert.com/mp4-to-gif -->


https://github.com/user-attachments/assets/5aae3a41-e0d5-43fd-b6c4-2f49810490f6




https://github.com/user-attachments/assets/08a32b88-0980-45b5-8239-1cc2adfb2a46



<!-- Or if you have an MP4 video, use this instead: -->
<!-- https://github.com/user-attachments/assets/YOUR_VIDEO_ID -->

</div>

## ✨ Features

- 🎯 **High Accuracy Detection** - Ensemble model combining TCN + ResNet-1D classifiers
- ⚡ **Real-time Analysis** - Get results in seconds
- 📱 **Mobile Friendly** - Responsive design works on all devices
- 🔒 **Privacy First** - Images are processed securely and not stored
- 🌐 **Free to Use** - No account required

## 🛠️ Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | React, TypeScript, Tailwind CSS, Vite |
| **Backend API** | Vercel Serverless Functions |
| **ML Model** | PyTorch, Qwen2.5-VL, TCN, ResNet-1D |
| **Model Hosting** | Hugging Face Spaces |
| **Deployment** | Vercel |

## 🧠 How It Works

1. **Feature Extraction** - Qwen2.5-VL-3B vision model extracts deep features from the image
2. **Dual Classification** - TCN and ResNet-1D classifiers analyze the features independently  
3. **Stacking Ensemble** - Meta-learner combines predictions for final verdict
4. **Result** - Returns AI probability percentage with confidence score

## 🚀 Run Locally

**Prerequisites:** Node.js 18+

```bash
# Clone the repo
git clone https://github.com/nahid0-0/Demectai.git
cd Demectai

# Install dependencies
npm install

# Start development server
npm run dev

# Start the proxy server (in another terminal)
node server.js
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
Demectai/
├── api/
│   └── detect.js        # Vercel serverless function
├── components/          # React components
├── services/
│   └── hfService.ts     # Hugging Face API integration
├── App.tsx              # Main app component
├── server.js            # Local proxy server
└── vercel.json          # Vercel configuration
```

## 🔗 Links

- **Live Website:** [demectai.vercel.app](https://demectai.vercel.app)
- **Hugging Face Space:** [nahid112376/demectai](https://huggingface.co/spaces/nahid112376/demectai)
- **GitHub:** [nahid0-0/Demectai](https://github.com/nahid0-0/Demectai)

## 📄 License

MIT License - feel free to use this project for your own purposes.

---

<div align="center">

Made with ❤️ by [nahid0-0](https://github.com/nahid0-0)

</div>
