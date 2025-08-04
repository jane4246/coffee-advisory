# Android Installation Guide for Nandi Coffee Advisory

## Why Installation Might Not Work

### Common Issues:
1. **Development Environment**: PWA installation works best on HTTPS (production)
2. **Browser Requirements**: Some browsers need specific conditions
3. **Android Version**: Older Android versions may have limited PWA support

## How to Install on Android (Multiple Methods)

### Method 1: Automatic Install Prompt ✅
1. Open the app in Chrome browser
2. Wait for install banner to appear
3. Tap "Install" when prompted
4. App appears on home screen

### Method 2: Chrome Menu Install 🔧
1. Open app in Chrome browser
2. Tap the 3-dot menu (⋮) in top-right corner
3. Look for:
   - "Install app" 
   - "Add to Home screen"
   - "Install Nandi Coffee Advisory"
4. Tap it and confirm
5. App icon appears on home screen

### Method 3: Address Bar Install 📱
1. Open app in Chrome
2. Look for install icon in address bar (⬇️ or +)
3. Tap the install icon
4. Confirm installation

### Method 4: Browser Bookmark (Fallback) 📌
If PWA install doesn't work:
1. Open app in browser
2. Bookmark the page
3. Add bookmark to home screen
4. Access like a regular app

## Troubleshooting

### If "Install" Option Doesn't Appear:
1. **Clear Browser Cache**:
   - Chrome → Settings → Privacy → Clear browsing data
   - Restart browser and try again

2. **Check Chrome Version**:
   - Chrome → Settings → About Chrome
   - Update to latest version if needed

3. **Try Different Browser**:
   - Firefox: Menu → "Install"
   - Samsung Internet: Menu → "Add page to" → "Home screen"
   - Edge: Menu → "Apps" → "Install this site as an app"

### If Installation Fails:
1. **Restart Phone**: Simple but often works
2. **Free Up Storage**: Ensure enough space (at least 100MB)
3. **Check Network**: Stable internet required for first install
4. **Try Incognito**: Open app in incognito/private mode

## Verification That App is Installed

### Signs of Successful Installation:
✅ App icon appears on home screen  
✅ Can find app in app drawer  
✅ Opens in full screen (no browser bar)  
✅ Can switch between apps normally  
✅ Works offline for basic features  

### App Icon Details:
- **Name**: "Nandi Coffee Advisory" or "Coffee Advisory"
- **Icon**: Green background with coffee plant design
- **Location**: Same place as other apps (home screen/app drawer)

## Using the Installed App

### Features Available Offline:
- Disease diagnosis from text descriptions
- Basic farming tips
- Emergency contact information
- Previous diagnosis history

### Features Requiring Internet:
- Image upload and analysis
- Voice recording processing
- Latest farming tips updates
- Syncing diagnosis history

## Distribution Tips for Extension Officers

### Sharing with Farmers:
1. **Send Direct Link**: Share the website URL via SMS/WhatsApp
2. **QR Code**: Create QR code for easy scanning
3. **Demo Installation**: Show farmers the install process in person
4. **Group Training**: Teach installation at farmer meetings

### Best Practices:
- **Test First**: Install on your own phone to demonstrate
- **Wi-Fi Setup**: Use Wi-Fi for initial download if available
- **Backup Method**: Teach bookmark method as fallback
- **Follow-up**: Check if farmers successfully installed after a few days

## Technical Details (For Developers)

### PWA Requirements Met:
✅ Manifest file with proper metadata  
✅ Service worker for offline functionality  
✅ HTTPS (required in production)  
✅ App icons and theme colors  
✅ Standalone display mode  

### Browser Support:
- ✅ Chrome 76+ (excellent)
- ✅ Firefox 79+ (good)
- ✅ Samsung Internet 7.2+ (good)
- ✅ Edge 79+ (excellent)
- ⚠️ Opera Mobile (limited)

### Next Steps for Production:
1. Deploy to HTTPS domain
2. Add proper PNG icons alongside SVG
3. Implement push notifications
4. Add offline data synchronization
5. Submit to Google Play Store as TWA (Trusted Web Activity)

---

**Need Help?** Contact agricultural extension services or share this guide with other farmers in your cooperative.