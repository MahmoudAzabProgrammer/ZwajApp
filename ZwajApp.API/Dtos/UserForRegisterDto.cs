using System.ComponentModel.DataAnnotations;

namespace ZwajApp.API.Dtos
{
    public class UserForRegisterDto
    {
        [Required]
        public string Username { get; set; }
        

        [StringLength(8,MinimumLength=4 ,ErrorMessage="يجب الا يقل عن اربعه حروف ولا يزيد عن ثمانيه احرف")]
        [Required]
        public string Password { get; set; }
    }
}