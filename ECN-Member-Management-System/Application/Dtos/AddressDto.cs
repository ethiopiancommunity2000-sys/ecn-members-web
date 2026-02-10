
using System;

namespace Application.Dtos
{
    public class AddressDto
    {
       public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Street { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string ZipCode { get; set; }
    }
}