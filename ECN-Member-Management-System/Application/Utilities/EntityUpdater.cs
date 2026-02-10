using System;
using System.Collections.Generic;
using AutoMapper;

namespace Application.Utilities
{
    public static class EntityUpdater
    {
        
        //todo Understanding Each Part
        //!     T → Member (Entity)
        //!     TDto → MemberDto
        //!     TKey → int (ID type)
        //!     idSelector → Function that extracts the ID from TDto, e.g., dto => dto.Id
        public static void UpdateNavigationEntities<T, TDto, TKey>(
            ICollection<T> entities,
            ICollection<TDto> dtos,
            IMapper _mapper,
            Func<TDto, TKey> idSelector, //! 	Returns TKey
            Action<T, TDto> updateAction //! 	Returns void

            ) where T : class, new() where TKey : notnull // Ensures non-nullable ID types

        {
           //! === var id = dtos.Select(dto => dto.Id).ToHashSet();
           // IEnumerable<TDto>.Select<TDto, TKey>(Func<TDto, TKey> selector) where TKey : notnull
            var dtoIds = dtos.Select(idSelector).ToHashSet();  
           
           //! Converts each entity (T) into a DTO (TDto) && Extracts the ID from the DTO using idSelector.
            var entityMap =  entities.ToDictionary(e => idSelector(_mapper.Map<TDto>(e))); // Entity lookup

            //! entityMap is == the ff  Dictionary<TKey, T>
            //!Why Not Map TDto → T Instead? The dictionary is used only for lookups, not for updating.
            //! If idSelector worked on T ==>var entityMap = entities.ToDictionary(e => idSelector(e));
            // Dictionary<TKey, T> entityMaps = entities.ToDictionary(e =>
            //     {
            //         var mappedDto = _mapper.Map<TDto>(e); // Convert entity to DTO
            //         return idSelector(mappedDto); // Extract ID without converting to string
            //     });


            // Remove entities not present in DTOs
            foreach (var entity in entities.Where(e => !dtoIds.Contains(idSelector(_mapper.Map<TDto>(e)))).ToList())
            {
                entities.Remove(entity);
            }

            // Add or update entities
            foreach (var dto in dtos)
            {
                var dtoId = idSelector(dto);
                // Treat empty string or null as new entity
                bool isNewEntity = dtoId == null || 
                                   (dtoId is string strId && string.IsNullOrWhiteSpace(strId)) ||
                                   (dtoId is Guid guidId && guidId == Guid.Empty);
                
                if (!isNewEntity && entityMap.TryGetValue(dtoId, out var entity))
                {
                    updateAction(entity, dto); // Update existing entity from dto.
                }
                else
                {
                    entity = new T();
                    _mapper.Map(dto, entity);
                    entities.Add(entity);
                }
            }
        }

        // Helper method to update navigation properties

            //! PLEAE NOTE why we say ==> where T : class   --  because we want to make sure that T is a reference type not value type
            //!If we didn't specify where T : class, someone could mistakenly call the method with List<int> or List<bool>
        public static void UpdateMemberNavigation<T, TDto, TKey>(
            ICollection<T> entities,
            ICollection<TDto> dtos,
            IMapper _mapper,
            Func<TDto, TKey> idSelector
            )
            
            where T : class, new()
            where TDto : class
            where TKey : notnull // Ensures non-nullable ID types
        {
            UpdateNavigationEntities(entities, dtos, _mapper, idSelector, (e, d) => _mapper.Map(d, e));
        }
    }

}