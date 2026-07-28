# mSurvey PWA v0.1

Versi awal aplikasi ukur untuk PC, Android dan iPhone melalui pelayar/PWA.

## Jalankan
Buka folder ini dengan pelayan web tempatan, contohnya:

```bash
python -m http.server 8080
```

Kemudian buka `http://localhost:8080`.

## Netlify
Seret folder ini ke Netlify Drop atau sambungkan repositori GitHub. Publish directory ialah `.`.

## Status formula
Berfungsi: BG/JK ke koordinat, koordinat ke BG/JK, titik tengah, luas poligon, persilangan garisan, pusat bulatan, ukur aras asas.

Belum diaktifkan sehingga formula APK disahkan: ukur trabas, hilang ke jarak, sekan lebar sama/beza dan sudut dalam.

Format bearing asal DDD.MMSS disokong.


## v0.2
- Modul Ukur Trabas diaktifkan untuk dua bearing/jarak.
- Bearing penutup dibundarkan kepada 1 saat terhampir.
- Jarak dipaparkan kepada 0.001 unit.
