# Panduan Setup MongoDB Cluster untuk Production

## Opsi Cloud Provider untuk MongoDB

Anda memiliki beberapa pilihan untuk setup MongoDB di cloud:

### 1. MongoDB Atlas (Recommended) ⭐

**MongoDB Atlas** adalah layanan database terkelola yang dapat berjalan di multiple cloud providers.

#### Keuntungan:
- ✅ Fully managed (backup, monitoring, scaling otomatis)
- ✅ Support AWS, GCP, dan Azure
- ✅ Free tier tersedia untuk development
- ✅ Auto-scaling dan high availability
- ✅ Security features built-in

#### Setup MongoDB Atlas:

1. **Daftar di MongoDB Atlas**
   - Kunjungi https://www.mongodb.com/cloud/atlas
   - Buat akun gratis

2. **Pilih Cloud Provider**
   - Pilih AWS, GCP, atau Azure sesuai kebutuhan
   - **Rekomendasi**: Pilih provider yang sama dengan backend hosting Anda
   
3. **Pilih Region**
   - Pilih region terdekat dengan server backend Anda
   - Contoh untuk Indonesia:
     - AWS: `ap-southeast-1` (Singapore)
     - GCP: `asia-southeast1` (Singapore)
     - Azure: `Southeast Asia`

4. **Konfigurasi Cluster**

```bash
# Pilih Tier (untuk development/production)
- M0 (Free): Development, testing
- M10+: Production (recommended)

# Cloud Provider Settings
Provider: AWS / GCP / Azure
Region: Pilih sesuai lokasi
```

5. **Tags Configuration** ⚠️ PENTING

**ISI TAG dengan informasi yang relevan!**

Contoh tags yang harus diisi:
```
Project: lkmo-recipes
Environment: development / production
Team: backend-team
CostCenter: engineering
ManagedBy: mongodb-atlas
```

**Kenapa harus isi tag?**
- ✅ Cost tracking & billing reports
- ✅ Resource organization & management
- ✅ Compliance & auditing
- ✅ Automation & infrastructure as code
- ✅ Quick identification

6. **Network Access (Whitelist IP)**

Untuk development:
```
IP Address: 0.0.0.0/0 (Allow dari anywhere)
Comment: Development - Remove for production!
```

Untuk production:
```
IP Address: Your-server-IP/32
Comment: Production server only
```

Atau untuk Railway/Render/Vercel:
```
IP Address: Tambahkan IP range dari platform
```

7. **Database Access (User Setup)**

```
Username: lkmo-user
Password: [Generate strong password]
Database User Privileges: Read and write to any database
```

8. **Connection String**

Setelah setup, Atlas akan memberikan connection string:
```
mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>?retryWrites=true&w=majority
```

Contoh lengkap:
```
mongodb+srv://lkmo-user:YourSecurePassword@cluster0.xxxxx.mongodb.net/lkmo-recipes?retryWrites=true&w=majority
```

### 2. AWS DocumentDB

Alternatif jika Anda ingin stay di ekosistem AWS.

**Keuntungan:**
- ✅ Fully managed oleh AWS
- ✅ Kompatibel dengan MongoDB API
- ✅ Integrasi dengan AWS services

**Kekurangan:**
- ❌ Tidak support semua fitur MongoDB terbaru
- ❌ Lebih mahal dibanding Atlas

### 3. Azure Cosmos DB (MongoDB API)

Alternatif jika Anda menggunakan Azure.

**Keuntungan:**
- ✅ Fully managed oleh Azure
- ✅ Global distribution
- ✅ Automatic scaling

**Kekurangan:**
- ❌ Kompatibilitas MongoDB terbatas
- ❌ Different pricing model

## Konfigurasi untuk Environment

### Development (.env)

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lkmo-recipes?retryWrites=true&w=majority
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads
```

### Production (.env)

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lkmo-recipes?retryWrites=true&w=majority
JWT_SECRET=super-strong-random-secret-256-bit-key
JWT_EXPIRE=7d
FRONTEND_URL=https://your-frontend-domain.com
MAX_FILE_SIZE=5242880
UPLOAD_PATH=uploads
```

## Setup Step-by-Step

### Setup MongoDB Atlas

1. **Buat akun**: https://www.mongodb.com/cloud/atlas/register

2. **Pilih deployment:**
   - Klik "Build a Database"
   - Pilih M0 Free tier (untuk development) atau M10+ (untuk production)

3. **Pilih Cloud Provider:**
   ```
   ☑ AWS
   ☑ Google Cloud
   ☑ Azure
   
   Region: Asia Pacific (Singapore) atau terdekat dengan Anda
   ```

4. **Beri nama cluster:** `lkmo-cluster`

5. **Setup Database Access:**
   - Username: pilih yang mudah diingat
   - Password: generate strong password
   - Save credentials!

6. **Setup Network Access:**
   - Add IP Address: `0.0.0.0/0` untuk development
   - Atau IP spesifik untuk production

7. **ISI TAG:**
   ```
   Key: Project          Value: lkmo-recipes
   Key: Environment      Value: development
   Key: Team             Value: lkmo-team
   Key: ManagedBy        Value: mongodb-atlas
   ```

8. **Database Configuration:**
   - Database Name: `lkmo-recipes`
   - Collections akan otomatis dibuat saat aplikasi berjalan

9. **Connect:**
   - Klik "Connect"
   - Choose "Connect your application"
   - Driver: Node.js
   - Copy connection string
   - Replace `<password>` dengan password Anda

10. **Update .env:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/lkmo-recipes
   ```

## Security Best Practices

### Production Checklist

- [ ] Gunakan strong password (min 12 karakter, mix of letters/numbers/symbols)
- [ ] Whitelist hanya IP production server
- [ ] Enable MongoDB Atlas encryption at rest
- [ ] Enable network peering jika menggunakan VPC
- [ ] Setup monitoring & alerts
- [ ] Enable automated backups
- [ ] Gunakan connection string dengan SSL/TLS
- [ ] Rotate credentials secara berkala
- [ ] Review database access logs

### Connection String Security

**Good:**
```
mongodb+srv://user:strongpass@cluster.mongodb.net/db?retryWrites=true&w=majority&ssl=true
```

**Bad:**
```
mongodb://localhost:27017/admin (no auth)
```

## Biaya Estimasi

### MongoDB Atlas Pricing (USD/month)

| Tier | RAM | Storage | Use Case | Price |
|------|-----|---------|----------|-------|
| M0 | 512MB | Shared | Development | **FREE** |
| M10 | 2GB | 10GB | Small production | ~$57 |
| M20 | 4GB | 20GB | Medium production | ~$150 |
| M30 | 8GB | 40GB | Large production | ~$290 |

### Comparison: Atlas vs DocumentDB vs Cosmos DB

| Feature | Atlas | DocumentDB | Cosmos DB |
|---------|-------|------------|-----------|
| Setup Difficulty | Easy | Medium | Easy |
| MongoDB Compatibility | 100% | ~95% | ~90% |
| Cost (entry) | Free | $180+ | $24+ |
| Region Selection | All | Limited | Good |
| Auto-scaling | Yes | Yes | Yes |
| Managed Backups | Yes | Yes | Yes |

**Rekomendasi:**
- **Development**: MongoDB Atlas M0 (FREE)
- **Production Small**: MongoDB Atlas M10 (~$57/mo)
- **Production Large**: MongoDB Atlas M30+ atau dedicated cluster

## Troubleshooting

### Connection Timeout

**Problem**: Cannot connect to MongoDB

**Solution**:
1. Check IP whitelist di Network Access
2. Verify username/password
3. Check connection string format
4. Test koneksi internet

### Authentication Failed

**Problem**: Authentication failed

**Solution**:
1. Verify username & password
2. Check user permissions
3. Ensure user has read/write access

### Slow Queries

**Problem**: Queries slow

**Solution**:
1. Add indexes pada frequently queried fields
2. Upgrade cluster tier
3. Enable connection pooling
4. Review query performance

## Monitoring & Alerts

### Setup Atlas Alerts

1. **Low Disk Space:**
   ```
   Metric: Disk Space Used
   Threshold: > 80%
   ```

2. **High Connections:**
   ```
   Metric: Connections
   Threshold: > 500
   ```

3. **Slow Queries:**
   ```
   Metric: Operation Execution Time
   Threshold: > 100ms
   ```

## Backup & Restore

### Automated Backups

MongoDB Atlas menyediakan:
- Continuous backups
- Point-in-time recovery
- Snapshot backups

**Setup:**
1. Atlas → Backup → Configure
2. Enable Cloud Backup
3. Set retention period
4. Schedule snapshots

### Manual Backup

```bash
# Export single collection
mongoexport --uri="mongodb+srv://..." --collection=recipes --out=recipes.json

# Import backup
mongoimport --uri="mongodb+srv://..." --collection=recipes --file=recipes.json
```

## Kesimpulan & Rekomendasi

### Untuk Project LKMO Recipes

**✅ Recommended Setup:**

```
Provider: MongoDB Atlas
Cloud: AWS (atau sesuai backend hosting)
Tier: M0 (development) → M10 (production)
Region: Asia Pacific (Singapore)
Tags: ISI dengan project info
IP Whitelist: Specific IPs untuk production
Backup: Enable automated backups
```

**Configuration Summary:**
```
☑ MongoDB Atlas (fully managed)
☑ AWS/GCP/Azure (pilih sesuai backend)
☑ Region terdekat dengan server
☑ Tags diisi untuk organization
☑ Network security enabled
☑ Automated backups enabled
☑ Monitoring & alerts setup
```

## Next Steps

1. Setup MongoDB Atlas cluster
2. Configure network access
3. Create database user
4. **ISI TAGS dengan informasi project**
5. Get connection string
6. Update .env file
7. Test connection
8. Setup monitoring
9. Enable backups

---

**Need Help?**
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com
- MongoDB Community Forum: https://developer.mongodb.com/community/forums
- Contact Support: support@mongodb.com

