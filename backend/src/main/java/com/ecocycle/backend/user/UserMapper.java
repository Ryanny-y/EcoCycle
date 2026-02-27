package com.ecocycle.backend.user;


import com.ecocycle.backend.user.dto.UserDto;
import com.ecocycle.backend.user.model.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedSourcePolicy = ReportingPolicy.IGNORE)
public interface UserMapper {

    @Mapping(target = "role", source = "role")
    UserDto toDto(User user);
}
