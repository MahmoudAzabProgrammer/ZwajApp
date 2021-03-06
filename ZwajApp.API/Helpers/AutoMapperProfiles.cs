using System.Linq;
using AutoMapper;
using ZwajApp.API.Dtos;
using ZwajApp.API.Models;

namespace ZwajApp.API.Helpers
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<User , UserForListDto>()
            .ForMember(dest => dest.PhotoURL , option => { option.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);})
            .ForMember(dest => dest.Age , option => { option.ResolveUsing(src => src.DateOfBirth.CalculateAge());});




            
            CreateMap<User , UserForDetailsDto>()
            .ForMember(dest => dest.PhotoURL , option => { option.MapFrom(src => src.Photos.FirstOrDefault(p => p.IsMain).Url);})
            .ForMember(dest => dest.Age , option => { option.ResolveUsing(src => src.DateOfBirth.CalculateAge());});




            
            CreateMap<Photo , PhotoForDetailsDto>();
            CreateMap<UserForUpdateDto , User>();
            CreateMap<Photo , PhotoForReturnDto>();
            CreateMap<PhotoForCreateDto , Photo>();
            CreateMap<UserForRegisterDto , User>();
            CreateMap<MessageForCreationDto,Message>();
            CreateMap<Message,MessageToReturnDto>()
            .ForMember(dest => dest.SenderPhotoUrl , option => { option.MapFrom(src => src.Sender.Photos.FirstOrDefault(p => p.IsMain).Url);})
            .ForMember(dest => dest.RecipientPhotoUrl , option => { option.MapFrom(src => src.Recipient.Photos.FirstOrDefault(p => p.IsMain).Url);});




            
        }
    }
}