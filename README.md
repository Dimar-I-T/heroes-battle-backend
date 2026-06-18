# Heroes Battle Backend
Heroes Battle API adalah sistem backend untuk game simulasi RPG. Backend ini mengimplementasikan security menggunakan JWT untuk melindungi rute dan data pemain. Fitur utamanya antara lain manajemen ekonomi game, seperti pembelian dan penjualan Hero/Item melalui operasi CRUD, serta sistem Auto Battle komprehensif yang menghitung jalannya pertarungan secara instan di memori server, mencegah potensi cheating dari sisi klien. API ini juga telah tervalidasi keamanannya melalui E2E Testing.

## Live Deployment
https://heroes-battle-backend.vercel.app

## Tech Stack
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeORM](https://img.shields.io/badge/TypeORM-FE0803?style=for-the-badge&logo=typeorm&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

## Architecture dan Design Patterns

Proyek ini dibuat menggunakan **Layered Architecture (Controller-Service Pattern)** yang dikombinasikan dengan **Aspect Oriented Programming** melalui fitur-fitur bawaan NestJS.

Alur Request Lifecycle dalam backend ini diatur secara ketat dengan urutan sebagai berikut:
**`Client Request` -> `Auth Guard` -> `Controller` -> `Service` -> `Response Interceptor` / `Exception Filter` -> `Client Response`**

### Alasan Menggunakan Pattern Ini:

**1. Separation of Concerns (Pemisahan Tugas yang Jelas)**
Saya memisahkan `Controller` dan `Service` agar kode lebih modular. `Controller` murni hanya bertugas menerima request HTTP dan meneruskan input, sedangkan `Service` (Business Logic) murni menangani aturan bisnis. Ini membuat kode sangat mudah dilakukan Unit Testing dan di-maintain

**2. Standardisasi Global dan Prinsip DRY (Don't Repeat Yourself)**
Alih-alih menulis format kembalian JSON secara manual di setiap fungsi controller, saya menggunakan **Global Response Interceptor**. Interceptor ini akan mencegat data dari Service dan secara otomatis membungkusnya menjadi format standar:
`{ "success": true, "message": "...", "data": {...} }`.
Hal ini menghilangkan duplikasi kode secara masif.

**3. Keamanan Terpusat (Centralized Security)**
Pengecekan JWT Token tidak dilakukan di dalam blok kode controller, melainkan dipusatkan di **Auth Guard**. Guard bertindak sebagai satpam di pintu gerbang utama, jika request tidak memiliki token yang valid, proses akan langsung ditolak (401 Unauthorized) sebelum sempat menyentuh Controller.

**4. Graceful Error Handling (Penanganan Error yang Elegan)**
Saya menghindari penggunaan `try-catch` yang berlebihan di level Controller/Service. Sebagai gantinya, saya menggunakan **Global Exception Filter**. Jika terjadi error di bagian mana pun dalam sistem, Filter ini akan otomatis menangkapnya dan memformat error menjadi struktur JSON yang informatif dan aman bagi client, lengkap dengan timestamp dan path:
```json
{
  "success": false,
  "error": {
    "statusCode": 400,
    "message": "Error details..."
  },
  "timestamp": "2026-06-18T16:00:00.000Z",
  "path": "/api/matches/start"
}
```

## ERD Diagram
<img width="894" height="685" alt="Untitled (8)" src="https://github.com/user-attachments/assets/e7e1797a-b87c-4fdf-aff5-65d507179c81" />

## Heroes Battle API Documentation

### Authentication

Semua endpoint di bawah ini bersifat publik (tidak memerlukan token).

#### Register Account

**Method dan Endpoint:** `POST /api/auth/register`

**Menerima (Body):**
- `username` (string, min. 3 karakter)
- `password` (string, min. 8 karakter, wajib mengandung huruf besar, huruf kecil, dan karakter spesial)

**Operasi Backend:**
- Validasi format username dan password.
- Hash password (misal: menggunakan Bcrypt).
- Simpan username dan hashed password ke database (`players`).
- Generate dan daftarkan JWT Token berdasarkan `player_id`.

**Output:**
```json
{ "success": true, "message": "...", "data": { "access_token": "..." } }
```

![image](https://hackmd.io/_uploads/r1_5ib-MGe.png)


#### Login

**Method dan Endpoint:** `POST /api/auth/login`

**Menerima (Body):**
- `username` (string)
- `password` (string)

**Operasi Backend:**
- Cari user berdasarkan username di database.
- Compare password yang diinput dengan hash password di database.
- Jika cocok, generate JWT Token berdasarkan `player_id`.

**Output:**
```json
{ "success": true, "message": "...", "data": { "access_token": "..." } }
```

![image](https://hackmd.io/_uploads/S1WnoZWMze.png)

#### Profile
**Method dan Endpoint:** `GET /api/auth/login`
**Operasi Backend:**
- Mengembalikan data lengkap player berdasarkan player_id pada request yang disimpan dari jwt

**Output:**
```json
{ "success": true, "message": "...", "data": { "..." } }
```
![image](https://hackmd.io/_uploads/rJCq6--GGg.png)

### Players (User Management)

#### Get All Players

**Method dan Endpoint:** `GET /api/players`

**Menerima (Query - Opsional):**
- `limit` (number, default: 10)
- `search` (string, mencari berdasarkan username)
- `sort` (opsi: `wins`, `losses`, `coins`)

**Operasi Backend:** Melakukan select data pemain dengan filter dan urutan sesuai query.

**Output:**
```json
{ "success": true, "message": "...", "data": [...] }
```
![image](https://hackmd.io/_uploads/BJ2DOfZzze.png)

![image](https://hackmd.io/_uploads/rywYdGZMfe.png)


#### Get Player by ID

**Method dan Endpoint:** `GET /api/players/:id`

**Menerima (Params):** `id` (player_id)

**Operasi Backend:** Melakukan select data satu pemain berdasarkan ID.

**Output:**
```json
{ "success": true, "message": "...", "data": {...} }
```

![image](https://hackmd.io/_uploads/B1eaBf-MGe.png)

#### Get Leaderboard

**Method dan Endpoint:** `GET /api/players/leaderboard`

**Menerima (Query):** `limit` (number, default: 10)

**Operasi Backend:** Mengambil daftar pemain dengan sorting wins terbanyak secara descending.

**Output:**
```json
{ "success": true, "message": "...", "data": [...] }
```

![image](https://hackmd.io/_uploads/SkMFqfZMzx.png)


#### Update My Profile

**Method dan Endpoint:** `PUT /api/players/me` (Requires JWT)

**Menerima (Body):**
- `username` (string, min. 3 karakter)

**Operasi Backend:** Mengubah username dari pemain yang sedang login (berdasarkan `player_id` di token).

**Output:**
```json
{ "success": true, "message": "...", "data": {...} }
```

![image](https://hackmd.io/_uploads/BJQ0pzbGGl.png)

### Master Data (Katalog)

Semua endpoint di bawah ini bersifat publik.

#### Get Heroes Catalog

**Method dan Endpoint:** `GET /api/heroes`

**Menerima (Query - Opsional):** `limit`, `search`, `sort` (`health` atau `damage`)

**Operasi Backend:** Mengambil daftar base heroes yang tersedia di dalam game.

**Output:**
```json
{ "success": true, "message": "...", "data": [...] }
```

![image](https://hackmd.io/_uploads/BJcaDEWfGl.png)


#### Get Items Catalog

**Method dan Endpoint:** `GET /api/items`

**Menerima (Query - Opsional):** `limit`, `search`, `sort` (`plus_health` atau `plus_damage`)

**Operasi Backend:** Mengambil daftar base items yang tersedia di shop.

**Output:**
```json
{ "success": true, "message": "...", "data": [...] }
```

![image](https://hackmd.io/_uploads/HkWxiVZzzx.png)

### Inventory System

Semua endpoint di bawah ini wajib melampirkan JWT.

#### Get My Heroes

**Method dan Endpoint:** `GET /api/player-heroes/me`

**Operasi Backend:** Mendapatkan semua data pahlawan yang dimiliki oleh pemain (join antara tabel `player_heroes` dan `heroes`).

**Output:**
```json
{ "success": true, "message": "...", "data": [...] }
```

![image](https://hackmd.io/_uploads/HkhQe8ZGGl.png)


#### Buy Hero

**Method dan Endpoint:** `POST /api/player-heroes/buy`

**Menerima (Body):** `hero_id` (ID dari master data heroes)

**Operasi Backend:**
- Harus belum pernah beli hero tersebut sebelumnya.
- Pastikan saldo `coins` pemain >= harga (`cost`) hero.
- Kurangi `coins` pemain.
- Tambahkan data ke tabel `player_heroes`.

**Output:**
```json
{ "success": true, "message": "...", "data": {...} }
```

![image](https://hackmd.io/_uploads/SJNu_H-Mfl.png)

![image](https://hackmd.io/_uploads/r1mK_SbMze.png)


#### Sell Hero

**Method dan Endpoint:** `DELETE /api/player-heroes/:id`

**Menerima (Params):** `id` (ID dari tabel `player_heroes`)

**Operasi Backend:**
- Validasi bahwa hero tersebut benar-benar milik pemain yang login.
- Hapus data dari tabel `player_heroes`.
- Tambahkan hasil penjualan ke `coins` pemain.

**Output:**
```json
{ "success": true, "message": "...", "data": {...} }
```

![image](https://hackmd.io/_uploads/Sy4kULWfzx.png)


#### Get My Items

**Method dan Endpoint:** `GET /api/player-items/me`

**Operasi Backend:** Mendapatkan semua item yang dimiliki oleh pemain.

**Output:**
```json
{ "success": true, "message": "...", "data": [...] }
```

![image](https://hackmd.io/_uploads/ByOcsUWfMe.png)


#### Buy Item

**Method dan Endpoint:** `POST /api/player-items/buy`

**Menerima (Body):** `item_id` (ID dari master data items)

**Operasi Backend:** Harus belum pernah beli item itu sebelumnya, Validasi saldo koin, kurangi koin, lalu insert ke tabel `player_items`.

**Output:**
```json
{ "success": true, "message": "...", "data": {...} }
```

![image](https://hackmd.io/_uploads/BJ1wo8Zzfg.png)

![image](https://hackmd.io/_uploads/BJEcs8ZMfx.png)


#### Sell Item

**Method dan Endpoint:** `DELETE /api/player-items/:id`

**Menerima (Params):** `id` (ID dari tabel `player_items`)

**Operasi Backend:** Validasi kepemilikan, hapus dari tabel `player_items`, lalu tambahkan koin hasil penjualan.

**Output:**
```json
{ "success": true, "message": "...", "data": {...} }
```

![image](https://hackmd.io/_uploads/SkQJ2IWffg.png)


### Match danBattle System

Semua endpoint di bawah ini wajib melampirkan JWT. 

#### Get My Matches

**Method dan Endpoint:** `GET /api/matches/me`

**Operasi Backend:** Mengambil seluruh riwayat pertandingan milik pemain yang sedang login.

**Output:**
```json
{ "success": true, "message": "...", "data": [...] }
```

![image](https://hackmd.io/_uploads/HyTiz9bzMg.png)


#### Start Match (Auto Battle System)

**Method dan Endpoint:** `POST /api/matches/start`

**Menerima (Body):** `hero_id` (ID dari hero milik pemain yang akan digunakan bertarung)

**Operasi Backend:**
- Validasi ketersediaan `hero_id` milik pemain.
- Generate musuh (random `enemy_hero_id`) dari master data heroes.
- Insert ke tabel `matches` dengan status `unfinished` (atau `ongoing`).
- Lakukan simulasi Auto-Battle di memori server (kalkulasi damage, batu-gunting-kertas, penggunaan item).
- result = win/lose tergantung darah siapa habis duluan
- Jika menang: Update tabel `players` -> `wins + 1` dan `coins + reward_amount`.
- Jika kalah: Update tabel `players` -> `losses + 1`.

**Output:**
```json
{ "success": true, "message": "...", "data": { "match_id": 1, "enemy": {...} } }
```

![image](https://hackmd.io/_uploads/rJChz9Wfzl.png)


## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
```bash
$ npm install -g @nestjs/mau
$ mau deploy
```
