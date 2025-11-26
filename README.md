# 🎥 MediaMTX Streaming Controller (Node.js + AWS EC2)

This project is a **Node.js Express API** that remotely controls **MediaMTX running on an AWS EC2 instance**.  
It establishes an SSH connection to EC2, starts MediaMTX in the background, triggers on-demand RTSP → RTMP → HLS transcoding, and exposes final HLS URLs for frontend clients.

---
#Deployment 
https://videostreamingfrontend-ojyp-lvplosoxl-soumya-rouls-projects.vercel.app

---
#Deployment errors ans issues
Mixed Content: The page at 'https://your-app.render.com' was loaded over HTTPS, 
but requested an insecure element 'http://3.16.91.248:8888/stream1/index.m3u8'. 
This request has been blocked; the content must be served over HTTPS.
"Works locally but not deployed?" This is a common HTTPS mixed content issue when deploying to platforms like Render/Vercel.
The Problem: Browsers block HTTP video streams on HTTPS pages for security.
However it works fine and video loads locally

## 🚀 Features

- 🔐 Connect to EC2 using SSH & private key  
- ▶️ Start MediaMTX remotely via API  
- 📡 Auto-spawn FFmpeg processes using `runOnDemand`  
- 🎬 Convert RTSP → RTMP → HLS  
- 🌍 Serve livestream over public IP (HLS)  
- ⚙️ Clean, scalable MediaMTX configuration  
- 📁 Organized project structure  
- 🧪 Tested with Postman & React frontend  

---

## 📂 Project Structure

root
│── server.js # Express API
│── ssh.js # SSH helper (node-ssh)
│── mediamtx.yml # MediaMTX configuration on EC2
│── package.json
└── README.md

yaml
Copy code

---

## 🔧 Requirements

- Node.js 16+
- AWS EC2 instance (Amazon Linux 2023 / Ubuntu)
- MediaMTX installed on EC2 at `/usr/local/bin/mediamtx`
- FFmpeg installed on EC2
- Open security group ports:
  - **22** (SSH)
  - **1935** (RTMP)
  - **8554** (RTSP)
  - **8888** (HLS)
  - Your Express API port (5000)

---

## 📡 MediaMTX Configuration (RTSP → RTMP → HLS)

The server automatically pulls from:

rtsp://13.60.76.79:8554/live3

bash
Copy code

Then pushes to local RTMP:

rtmp://localhost:1935/stream1

yaml
Copy code

And MediaMTX produces HLS at:

http://<ec2-ip>:8888/stream1/index.m3u8

yaml
Copy code

Example `mediamtx.yml` used in this project:

```yaml
rtmp: yes
rtmpAddress: :1935

hls: yes
hlsAddress: :8888
hlsSegmentDuration: 2s
hlsSegmentCount: 3
hlsAllowOrigins: ["*"]

paths:
  stream1:
    runOnDemand: >
      /usr/local/bin/ffmpeg -rtsp_transport tcp
      -i rtsp://13.60.76.79:8554/live3
      -c copy -f flv rtmp://localhost:1935/stream1
    runOnDemandRestart: yes
```

🖥️ API Endpoints
1️⃣ Start MediaMTX on EC2
bash
Copy code
POST http://localhost:5000/start-mt
Response:

json
Copy code
{
  "status": "MediaMTX started",
  "hls": "http://<ec2-ip>:8888/stream1/index.m3u8"
}
⚙️ Environment Variables
Create .env:

ini
Copy code
EC2_HOST=3.16.91.248
EC2_USERNAME=ec2-user
EC2_PRIVATE_KEY=./mediamtx-key.pem
MEDIAMTX_PATH=/usr/local/bin/mediamtx
MEDIAMTX_CONFIG=/home/ec2-user/mediamtx.yml
▶️ Running the Server (with Nodemon)
Install nodemon:

css
Copy code
npm i -g nodemon
Start the API:

nginx
Copy code
nodemon server.js
API will run at:

arduino
Copy code
http://localhost:5000
