# Wallpaper
This class returned current wallpaper image

### Supported platforms
- Linux ❌
- Mac OS ✅
- Windows ✅

### How to use

```tsx
const myUsbDevices = async () => {
    const wallpaper = new Wallpaper();
    const img = await wallpaper.getImage();

    console.log(img); // base64 image
};
```