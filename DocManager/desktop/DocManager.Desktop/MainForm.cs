using System.Diagnostics;
using System.Net.Sockets;
using Microsoft.Web.WebView2.Core;
using Microsoft.Web.WebView2.WinForms;

namespace DocManager.Desktop;

/// <summary>Starts the bundled API (if it isn't already running) and shows the app in a native window.</summary>
public class MainForm : Form
{
    private const int Port = 5000;
    private readonly string url = $"http://127.0.0.1:{Port}";
    private readonly WebView2 web = new() { Dock = DockStyle.Fill };
    private readonly Label status = new()
    {
        Dock = DockStyle.Fill, TextAlign = ContentAlignment.MiddleCenter,
        Font = new Font("Segoe UI", 12), Text = "Starting Document Manager…"
    };
    private Process? server;

    public MainForm()
    {
        Text = "Document Manager";
        WindowState = FormWindowState.Maximized;
        MinimumSize = new Size(900, 600);
        Controls.Add(web);
        Controls.Add(status);
        status.BringToFront();
        Load += async (_, _) => await StartAsync();
        FormClosing += (_, _) => StopServer();
    }

    private async Task StartAsync()
    {
        try
        {
            if (!IsListening()) StartServer();
            await WaitForServerAsync();

            var dataFolder = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "DocManager");
            var env = await CoreWebView2Environment.CreateAsync(null, dataFolder);
            await web.EnsureCoreWebView2Async(env);
            web.CoreWebView2.Settings.AreDevToolsEnabled = false;
            web.Source = new Uri(url);
            status.Visible = false;
        }
        catch (Exception ex)
        {
            MessageBox.Show(ex.Message, "Document Manager", MessageBoxButtons.OK, MessageBoxIcon.Error);
            Close();
        }
    }

    private void StartServer()
    {
        var exe = Path.Combine(AppContext.BaseDirectory, "server", "DocManager.Api.exe");
        if (!File.Exists(exe)) throw new FileNotFoundException("Server files not found: " + exe);
        server = Process.Start(new ProcessStartInfo(exe, $"--Urls={url}")
        {
            WorkingDirectory = Path.GetDirectoryName(exe)!,
            CreateNoWindow = true,
            UseShellExecute = false
        });
    }

    private async Task WaitForServerAsync()
    {
        using var http = new HttpClient();
        for (var i = 0; i < 60; i++)
        {
            if (server is { HasExited: true })
                throw new Exception("The server stopped unexpectedly. Check the SQL Server connection in server\\appsettings.Production.json.");
            try { if ((await http.GetAsync(url)).IsSuccessStatusCode) return; } catch { /* not ready yet */ }
            await Task.Delay(500);
        }
        throw new Exception("The server did not start in time.");
    }

    private static bool IsListening()
    {
        try { using var c = new TcpClient(); return c.ConnectAsync("127.0.0.1", Port).Wait(300); }
        catch { return false; }
    }

    private void StopServer()
    {
        if (server is { HasExited: false }) server.Kill(entireProcessTree: true);   // only if we started it
    }
}
