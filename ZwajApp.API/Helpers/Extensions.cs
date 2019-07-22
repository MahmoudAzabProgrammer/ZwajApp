using System;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace ZwajApp.API.Helpers
{
    public static class Extensions
    {   
        public static void addApplicationError(this HttpResponse response , string message){
            response.Headers.Add("Application-Error" , message);
            response.Headers.Add("Access-Control-Expose-Headers","Application-Error");
            response.Headers.Add("Access-Control-Allow-Origin","*");
        }
        public static int CalculateAge(this DateTime dateTime){
            var age = DateTime.Today.Year - dateTime.Year;
            if(dateTime.AddYears(age) > DateTime.Today) age-- ;
            return age;
        }
        public static void AddPagination(this HttpResponse response , int currentPage, int itemsPerpage, int totalItems, int totalPages)
        {
            var paginationHeader = new PaginationHeader(currentPage, itemsPerpage, totalItems, totalPages);
            var camelCaseFormatter = new JsonSerializerSettings();
            camelCaseFormatter.ContractResolver = new CamelCasePropertyNamesContractResolver();
            response.Headers.Add("Pagination", JsonConvert.SerializeObject(paginationHeader, camelCaseFormatter));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
            
        }
    }
}