namespace DocManager.Desktop;

static class Program
{
    [STAThread]
    static void Main()
    {
        using var mutex = new Mutex(true, "DocManager.Desktop.SingleInstance", out var isFirst);
        if (!isFirst) return;   // already open

        ApplicationConfiguration.Initialize();
        Application.Run(new MainForm());
    }
}
