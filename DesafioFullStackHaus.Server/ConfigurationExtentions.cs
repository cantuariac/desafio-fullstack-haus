using DesafioFullStackHaus.Server.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace DesafioFullStackHaus.Server
{
    public static class ConfigurationExtentions
    {
        public static IServiceCollection ResolveConfigurations(this IServiceCollection services)
        {

            services.AddAuthorization();
            services.AddIdentityApiEndpoints<IdentityUser>().AddEntityFrameworkStores<DesafioHausDbContext>();
            services.AddScoped<AcaoRepository>();

            return services;
        }
        public static IServiceCollection ResolvePostgre(this IServiceCollection services, String connectionString)
        {
            services.AddDbContext<DesafioHausDbContext>(options => options.UseNpgsql(connectionString: connectionString));

            return services;
        }
        public static IServiceCollection ResolveSqlServer(this IServiceCollection services, String connectionString)
        {
            services.AddDbContext<DesafioHausDbContext>(options => options.UseSqlServer(connectionString: connectionString));

            return services;
        }

    }
}