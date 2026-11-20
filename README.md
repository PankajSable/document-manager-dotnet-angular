# Document Manager

A Windows desktop application for property brokers to store, organise and find client documents. Files are stored inside **SQL Server**, grouped in **client folders**, and a **dashboard** warns you before important documents expire.

Built with **.NET 10 Web API**, **Angular 21**, **SQL Server** and **Bootstrap 5**, and packaged as a single `DocManager.exe` that opens in its own window.

## Screenshots

### Login
<img width="1918" height="1030" alt="login" src="https://github.com/user-attachments/assets/eef8a1fb-271a-4edc-8910-fdac2e20f4dc" />


### Clients
<img width="1917" height="1029" alt="clients" src="https://github.com/user-attachments/assets/cf4c98c2-0e83-41a4-a472-556e2dcc24f5" />


### Add document
<img width="1917" height="1030" alt="add-document" src="https://github.com/user-attachments/assets/d1f97d5a-ca05-4d60-8a39-7b9084eebd2b" />


### Search
<img width="1916" height="1030" alt="search" src="https://github.com/user-attachments/assets/e8e8add0-1b7b-4740-872b-b406473119a9" />


### Document view
<img width="1917" height="1030" alt="add-document" src="https://github.com/user-attachments/assets/184c83d6-ccf0-421b-9b09-0a20a9ff65c8" />


## Features

- **Login and roles**: Admin and Staff accounts, JWT sessions (8 hours), BCrypt-hashed passwords.
- **Dashboard**: totals for clients and documents, expired count, expiring-in-30-days count, and a colour-coded list of everything expired or due within 60 days.
- **Client folders**: add, edit and search clients; each client has a folder page listing their documents.
- **Documents**: upload PDF, image or Word files (max 20 MB), with type, property address, expiry date and notes.
- **Automatic document ID**: built from client name, document type, date added and a running number, for example `SHARMA-SALE DEED-20261120-0001`.
- **Automatic file naming**: the uploaded file is renamed to its document ID plus the original extension.
- **Edit and replace file**: update details or upload a replacement; the ID never changes.
- **Search**: by client name, document ID (partial), document type and date-added range.
- **View and download**: in-app preview for PDFs and images, one-click download.
- **User management** (Admin): add users, change roles, deactivate, reset passwords.
- **Desktop app**: double-click `DocManager.exe`; the bundled API starts in the background and stops when you close the window.

## Tech stack

| Layer | Technology |
|---|---|
| Backend | .NET 10, ASP.NET Core Web API (controllers), Entity Framework Core, JWT authentication |
| Database | SQL Server (files stored as `varbinary(max)`) |
| Frontend | Angular 21 (standalone components, signals), Bootstrap 5, Bootstrap Icons |
| Desktop shell | Windows Forms + Microsoft Edge WebView2 |
| Installer | Inno Setup (optional) |

## Project structure

```
DocManager/
├── backend/DocManager.Api/        .NET 10 Web API
│   ├── Controllers/               Auth, Users, Clients, Documents, Dashboard
│   ├── Entities/                  AppUser, Client, Document, DocumentBlob
│   ├── DTOs/                      request and response models
│   ├── Data/                      AppDbContext, DbSeeder
│   └── Services/                  TokenService, JwtKeyProvider, DocumentMappings
├── frontend/                      Angular 21 app
│   └── src/app/
│       ├── components/            login, dashboard, clients, client-detail,
│       │                          document-form, document-search, document-view, users
│       ├── services/              auth, client, document, dashboard, user, interceptor
│       ├── models/  guards/  helpers/
├── desktop/DocManager.Desktop/    WinForms + WebView2 window (builds DocManager.exe)
├── installer/                     Inno Setup script
├── publish-desktop.ps1            builds everything into dist/DocManager
├── publish.ps1                    browser-only build (no desktop window)
└── start.bat                      launcher for the browser-only build
```

## Prerequisites

- Windows 10 or 11 (64-bit)
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [Node.js](https://nodejs.org/) 20.19+, 22.12+ or 24+
- Angular CLI 21: `npm i -g @angular/cli@21`
- SQL Server (Express or Developer) and optionally SQL Server Management Studio
- Visual Studio 2026 (for .NET 10) and/or VS Code

## Getting started (development)

### 1. Configure the database

Edit `backend/DocManager.Api/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "Default": "Server=localhost;Database=DocManagerDb;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

For SQL Express use `Server=.\\SQLEXPRESS`. For a SQL login use `User Id=...;Password=...` instead of `Trusted_Connection`.

The database, tables and the first admin user are created automatically on first run. The JWT signing key is generated on first run and saved to `App_Data/jwt.key`.

### 2. Run the API

```bash
cd backend/DocManager.Api
dotnet run
```

The API listens on `http://localhost:5000`.

### 3. Run the frontend

```bash
cd frontend
npm install
ng serve
```

Open `http://localhost:4200`.

### 4. First login

| Username | Password |
|---|---|
| `admin` | `Admin@123` |

**Change this password immediately** from the Users page.

## Build the desktop app

```powershell
powershell -ExecutionPolicy Bypass -File .\publish-desktop.ps1
```

The result is in `dist/DocManager/`:

```
DocManager.exe        double-click to run
server/               bundled API (DocManager.Api.exe, wwwroot, appsettings.json)
```

- The output is self-contained, so the target PC does not need .NET or Node installed.
- Set the SQL Server connection in `dist/DocManager/server/appsettings.json` (or `appsettings.Production.json`).
- Do not install under `C:\Program Files`; the API writes `App_Data/jwt.key` next to itself.
- Windows 10 PCs without the WebView2 runtime need the free [WebView2 Runtime](https://developer.microsoft.com/microsoft-edge/webview2/).

### Optional installer

Open `installer/DocumentManager.iss` in [Inno Setup](https://jrsoftware.org/isinfo.php) and press **F9** to produce `dist/DocumentManager-Setup.exe`. It installs per user and keeps `*.Production.json` and `App_Data` when updating.

### Browser-only build

`publish.ps1` bundles Angular into the API and publishes to `publish/`. Run `publish/start.bat` and open `http://localhost:5000`.

## API overview

All endpoints except login require `Authorization: Bearer <token>`.

| Method | Endpoint | Access |
|---|---|---|
| POST | `/api/auth/login` | Public |
| GET | `/api/dashboard` | Any user |
| GET, POST | `/api/clients` | Any user |
| GET, PUT | `/api/clients/{id}` | Any user |
| DELETE | `/api/clients/{id}` | Admin |
| GET | `/api/documents` (filters: `name`, `type`, `documentId`, `from`, `to`) | Any user |
| GET | `/api/documents/{id}` | Any user |
| POST | `/api/documents` (multipart form) | Any user |
| PUT | `/api/documents/{id}` (multipart form, file optional) | Any user |
| GET | `/api/documents/{id}/file?download=true` | Any user |
| DELETE | `/api/documents/{id}` | Admin |
| GET, POST | `/api/users` | Admin |
| PUT | `/api/users/{id}` | Admin |

## Roles

| Role | Can do |
|---|---|
| **Admin** | Everything: delete documents and clients, manage users |
| **Staff** | Add, view and edit documents and clients |

## Configuration reference

| Setting | Where | Default |
|---|---|---|
| SQL Server connection | `appsettings.json` → `ConnectionStrings:Default` | `localhost`, database `DocManagerDb` |
| Listening address | `appsettings.json` → `Urls` | `http://0.0.0.0:5000` (the desktop app forces `127.0.0.1`) |
| Max upload size | `DocumentsController.cs` → `MaxFileSize` | 20 MB |
| Expiry warning window | `DashboardController.cs` | 60 days |
| Document types | `frontend/src/app/models/models.ts` → `DOCUMENT_TYPES` | 10 property document types |
| Theme colours | `frontend/src/styles.css` → `:root` | Midnight Gold |

## Data safety

- Files and records live in one SQL Server database, so a single database backup protects everything.
- **Set up automatic daily backups** and keep a copy on a second drive or cloud storage.
- Deleting a document is permanent. Only Admins can delete.
- SQL Server Express limits a database to 10 GB.
- Never commit `App_Data/jwt.key` or production connection strings.

## Security notes

- Change the default `admin` password before real use.
- Passwords are stored as BCrypt hashes; tokens are signed with a per-installation key.
- The desktop app serves the API on `127.0.0.1` only. If you expose the browser build on a network, use HTTPS through a reverse proxy.

## Roadmap

- [ ] Recycle bin (restore deleted documents)
- [ ] File version history
- [ ] Audit log of all actions
- [ ] Email / WhatsApp expiry reminders
- [ ] Per-client access control
- [ ] Automatic backups from inside the app

## Troubleshooting

| Problem | Fix |
|---|---|
| "Server did not start" in the desktop window | Check the connection string and that SQL Server is running |
| Cannot open database / login failed | Confirm the SQL login can create databases; for SQL logins enable mixed mode authentication |
| Port 5000 already in use | Close other copies of the app, or change `Urls`, `MainForm.cs` (`Port`) and `helpers.ts` |
| Blank window or WebView2 error | Install the WebView2 Runtime |
| Everyone logged out after moving the folder | Copy `server/App_Data/jwt.key` too |
| Schema errors after pulling model changes | Tables are not migrated automatically; apply `ALTER TABLE` changes (or recreate a development database) |

## Contributing

1. Fork the repository and create a feature branch.
2. Make your change and test it in development mode.
3. Open a pull request describing what changed and why.

## License

Add a license of your choice (for example MIT) as a `LICENSE` file and name it here.
