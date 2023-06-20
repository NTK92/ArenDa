namespace Diplom.Helpers;

public class FileSaver
{
    private IWebHostEnvironment _env;

    public FileSaver(IWebHostEnvironment env)
    {
        _env = env;
    }

    public async Task FileSaveAsync(IFormFile file,string filepath,string filename)
    {
        string route  = Path.Combine(_env.ContentRootPath, filepath);
        if (Directory.Exists(route))
        {
            Directory.CreateDirectory(route);
        }
        string fileRoute = Path.Combine(route, filename);
        using (FileStream fs =File.Create(fileRoute))
        {
            await file.OpenReadStream().CopyToAsync(fs);
        }
    }
}