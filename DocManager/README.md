# Document Manager – .NET 10 + Angular 21 + SQL Server + Bootstrap

## Backend
1. Edit `backend/DocManager.Api/appsettings.json` (SQL Server connection string). The JWT signing key is generated automatically on first run and saved in `App_Data/jwt.key` (keep that file private and don't commit it; deleting it logs everyone out).
2. If you ran the earlier version, DROP the old `DocManagerDb` database first (the schema changed).
3. `cd backend/DocManager.Api && dotnet restore && dotnet run` -> API on http://localhost:5000.
   Database and tables are created on first run. Default login: admin / Admin@123 (change it in Users).
   Files are stored inside SQL Server (varbinary(max)), 20 MB limit per file.

## Backend structure
`Controllers/` (Auth, Users, Clients, Documents, Dashboard) · `Entities/` · `DTOs/` · `Data/` (DbContext, seeder) · `Services/` (token, mappings)

## Frontend
```
npm i -g @angular/cli@21
ng new frontend --routing=false --style=css --skip-git
cd frontend && npm i bootstrap
```
1. In `angular.json` > build > options > `styles`, add `"node_modules/bootstrap/dist/css/bootstrap.min.css"` before `src/styles.css`.
2. Replace `frontend/src/app/` with `frontend-src/app/` (delete generated app.html, app.css, app.spec.ts).
3. `ng serve` -> http://localhost:4200

## Features
Dashboard with expiry reminders, client folders, add/edit/replace file, search, in-browser preview and download,
roles (Admin: delete + user management; Staff: add/view/edit), user management page.
