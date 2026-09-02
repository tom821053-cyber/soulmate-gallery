# 💗 Soulmate Gallery - My Soulmate Eniya 💗

A beautiful, romantic private memory gallery website where you can create personalized galleries, upload photos, and share them with your special someone.

## ✨ Features

- 📸 **Create Private Galleries** - Create your own memory gallery with a unique link
- 🔐 **Owner Authentication** - Local storage-based ownership verification
- 📤 **Photo Upload** - Upload multiple photos to your gallery
- 🎨 **Beautiful UI** - Romantic gradient design with floating heart animations
- 🔗 **Share Your Gallery** - Get a unique link to share with your loved one
- ☁️ **Cloud Storage** - Photos stored securely in Supabase

## 🚀 Getting Started

### Prerequisites
- Supabase account (free tier available at [supabase.com](https://supabase.com))
- A web server or GitHub Pages to host the site

### Setup Instructions

1. **Clone or download this repository**

2. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com) and create a free account
   - Create a new project
   - Copy your `Project URL` and `Anon Key`

3. **Create Database Tables**
   
   In Supabase SQL Editor, run these queries:

   ```sql
   -- Galleries table
   CREATE TABLE galleries (
     id VARCHAR PRIMARY KEY,
     name VARCHAR NOT NULL,
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Photos table
   CREATE TABLE photos (
     id BIGSERIAL PRIMARY KEY,
     gallery_id VARCHAR NOT NULL,
     file_path VARCHAR NOT NULL,
     uploaded_at TIMESTAMP DEFAULT NOW(),
     FOREIGN KEY (gallery_id) REFERENCES galleries(id)
   );
   ```

4. **Create Storage Bucket**
   - Go to Storage in Supabase dashboard
   - Create a new bucket called `gallery-photos`
   - Make it public by setting appropriate policies

5. **Update Configuration**
   - Open `script.js`
   - Replace these lines with your Supabase credentials:
   ```javascript
   const SUPABASE_URL = 'https://your-project.supabase.co';
   const SUPABASE_KEY = 'your-anon-key';
   ```

6. **Deploy**
   - Upload all files to your web server or GitHub Pages
   - Open `index.html` in your browser

## 📖 How to Use

### Creating a Gallery
1. Enter a gallery name (e.g., "Me & Eniya 💗")
2. Click "Create Gallery ✨"
3. You'll get your own unique share link

### Uploading Photos
1. Click on "📸 Choose Photos" to select images
2. Preview them before saving
3. Click "💾 Save Photos" to upload
4. Photos will be stored in the cloud

### Sharing Your Gallery
1. Copy your gallery link using "📋 Copy Link"
2. Send it to your loved one
3. They can view all your memories by opening the link

### Viewing a Gallery
- If you're the owner, you can upload more photos
- If you're a viewer, you can see all the beautiful memories
- Hover over photos to see the heart animation

## 🎨 Customization

### Change the Colors
Edit the gradient in `style.css`:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

### Change the Title
Edit `index.html`:
```html
<h1>💗 My Soulmate [Your Name] 💗</h1>
```

### Add More Emojis
Replace the emoji strings throughout the code with your favorites!

## 🔒 Security & Privacy

- **Owner Verification**: Uses localStorage to verify gallery ownership
- **Photo Storage**: Photos stored in Supabase with access control
- **Private by Default**: Galleries are only accessible via direct link
- **No Authentication Required**: Simple and easy to use

## 📱 Responsive Design

The website works beautifully on:
- 💻 Desktop
- 📱 Mobile
- 📊 Tablets

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Supabase (PostgreSQL + Storage)
- **Styling**: CSS Grid & Flexbox with animations
- **Hosting**: Any web server or GitHub Pages

## 📝 File Structure

```
soulmate-gallery/
├── index.html      # Main HTML structure
├── style.css       # Beautiful styling & animations
├── script.js       # Core functionality
└── README.md       # This file
```

## 🎯 Future Enhancements

- [ ] Photo deletion capability
- [ ] Photo captions/descriptions
- [ ] Date-based photo filtering
- [ ] Slideshow mode
- [ ] Photo download option
- [ ] Gallery password protection
- [ ] Multiple galleries per user

## ❤️ Made with Love

This website is designed to celebrate your special memories together. Every heart, every animation, and every feature is crafted to make your love story shine.

---

**Made with 💗 by tom821053-cyber**

For support or questions, feel free to open an issue on GitHub!