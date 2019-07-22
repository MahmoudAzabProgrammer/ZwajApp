namespace ZwajApp.API.Helpers
{
    public class PaginationHeader
    {
        public int CurrentPage { get; set; }
        public int ItemsPerpage { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }

        public PaginationHeader(int currentPage, int itemsPerpage, int totalItems, int totalPages)
        {
            this.CurrentPage = currentPage;
            this.ItemsPerpage = itemsPerpage;
            this.TotalItems = totalItems;
            this.TotalPages = totalPages;
        }


    }
}