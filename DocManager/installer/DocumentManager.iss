; Inno Setup script - builds dist\DocumentManager-Setup.exe (install Inno Setup from jrsoftware.org, open this file, press F9)
[Setup]
AppName=Document Manager
AppVersion=1.0
DefaultDirName={localappdata}\Programs\DocManager
DefaultGroupName=Document Manager
PrivilegesRequired=lowest
OutputDir=..\dist
OutputBaseFilename=DocumentManager-Setup
Compression=lzma2
SolidCompression=yes

[Files]
; keeps the customer's database settings and JWT key when updating
Source: "..\dist\DocManager\*"; DestDir: "{app}"; Flags: recursesubdirs ignoreversion; Excludes: "*.Production.json,App_Data\*"

[Icons]
Name: "{autoprograms}\Document Manager"; Filename: "{app}\DocManager.exe"
Name: "{autodesktop}\Document Manager"; Filename: "{app}\DocManager.exe"

[Run]
Filename: "{app}\DocManager.exe"; Description: "Launch Document Manager"; Flags: nowait postinstall skipifsilent
